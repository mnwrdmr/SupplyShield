"use client";
import { useEffect, useCallback, useState } from "react";
import { useAsync } from "./useAsync";
import { riskApi, agentApi } from "../lib/api";
import type { RiskSummary, AgentAnalysisResult } from "../lib/types";

export function useLogistics() {
  const { data: products, loading, error, execute } = useAsync<RiskSummary[]>();
  const [plans, setPlans] = useState<Record<string, AgentAnalysisResult>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const load = useCallback(() => execute(riskApi.getAllRisks()), [execute]);

  useEffect(() => { load(); }, [load]);

  const loadPlan = useCallback(async (productId: string) => {
    if (plans[productId]) return;
    setLoadingId(productId);
    try {
      const result = await agentApi.analyzeProduct({ product_id: productId, analysis_depth: "full" });
      setPlans((prev) => ({ ...prev, [productId]: result }));
    } finally {
      setLoadingId(null);
    }
  }, [plans]);

  const loadAllPlans = useCallback(async () => {
    if (!products) return;
    for (const p of products) {
      if (!plans[p.product_id]) {
        setLoadingId(p.product_id);
        try {
          const result = await agentApi.analyzeProduct({ product_id: p.product_id, analysis_depth: "full" });
          setPlans((prev) => ({ ...prev, [p.product_id]: result }));
        } catch { /* continue */ }
      }
    }
    setLoadingId(null);
  }, [products, plans]);

  return {
    products: products ?? [],
    loading,
    error,
    plans,
    loadingId,
    loadPlan,
    loadAllPlans,
    refresh: load,
  };
}
