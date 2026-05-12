"use client";
import { useEffect, useCallback, useState } from "react";
import { useAsync } from "./useAsync";
import { riskApi, agentApi } from "../lib/api";
import type { RiskSummary, AgentAnalysisResult } from "../lib/types";

export function useRiskAnalysis() {
  const { data: risks, loading, error, execute } = useAsync<RiskSummary[]>();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AgentAnalysisResult | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const load = useCallback(() => execute(riskApi.getAllRisks()), [execute]);

  useEffect(() => { load(); }, [load]);

  const analyzeProduct = useCallback(async (productId: string) => {
    setSelectedId(productId);
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const result = await agentApi.analyzeProduct({ product_id: productId, analysis_depth: "full" });
      setAnalysisResult(result);
    } finally {
      setAnalysisLoading(false);
    }
  }, []);

  return {
    risks: risks ?? [],
    loading,
    error,
    refresh: load,
    selectedId,
    analysisResult,
    analysisLoading,
    analyzeProduct,
  };
}
