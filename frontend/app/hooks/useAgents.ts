"use client";
import { useCallback, useState } from "react";
import { useAsync } from "./useAsync";
import { riskApi, agentApi } from "../lib/api";
import type { RiskSummary, AgentAnalysisResult } from "../lib/types";

export interface AgentRun {
  productId: string;
  productName: string;
  result: AgentAnalysisResult | null;
  status: "idle" | "running" | "done" | "error";
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export function useAgents() {
  const { data: products, loading: productsLoading, execute } = useAsync<RiskSummary[]>();
  const [runs, setRuns] = useState<AgentRun[]>([]);
  const [pipelineRunning, setPipelineRunning] = useState(false);

  const loadProducts = useCallback(() => execute(riskApi.getAllRisks()), [execute]);

  const runSingleAgent = useCallback(async (product: RiskSummary) => {
    const runEntry: AgentRun = {
      productId: product.product_id,
      productName: product.product_name,
      result: null,
      status: "running",
      startedAt: new Date().toISOString(),
    };

    setRuns((prev) => {
      const filtered = prev.filter((r) => r.productId !== product.product_id);
      return [runEntry, ...filtered];
    });

    try {
      const result = await agentApi.analyzeProduct({
        product_id: product.product_id,
        analysis_depth: "full",
      });
      setRuns((prev) =>
        prev.map((r) =>
          r.productId === product.product_id
            ? { ...r, result, status: "done", completedAt: new Date().toISOString() }
            : r
        )
      );
    } catch (err) {
      setRuns((prev) =>
        prev.map((r) =>
          r.productId === product.product_id
            ? { ...r, status: "error", error: String(err), completedAt: new Date().toISOString() }
            : r
        )
      );
    }
  }, []);

  const runFullPipeline = useCallback(async (productList: RiskSummary[]) => {
    setPipelineRunning(true);
    for (const p of productList) {
      await runSingleAgent(p);
    }
    setPipelineRunning(false);
  }, [runSingleAgent]);

  const clearRuns = useCallback(() => setRuns([]), []);

  return {
    products: products ?? [],
    productsLoading,
    loadProducts,
    runs,
    pipelineRunning,
    runSingleAgent,
    runFullPipeline,
    clearRuns,
  };
}
