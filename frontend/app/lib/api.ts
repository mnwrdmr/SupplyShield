import type {
  DashboardSummary,
  RiskSummary,
  ProductRisk,
  InventoryItem,
  AgentAnalysisResult,
  AgentRequest,
} from "./types";

const BASE = "http://localhost:8000/api/v1";

// ─── Generic fetch helper (DRY + error boundary) ──────────────────────────────

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("supplyshield_token") : null;
  const headers: HeadersInit = { "Content-Type": "application/json" };
  if (token) (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, {
    headers,
    ...init,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return res.json() as Promise<T>;
}

// ─── Dashboard API ────────────────────────────────────────────────────────────

export const dashboardApi = {
  getSummary: () => apiFetch<DashboardSummary>("/dashboard/summary"),
};

// ─── Risk API (agent-driven) ──────────────────────────────────────────────────

export const riskApi = {
  getAllRisks: async (): Promise<RiskSummary[]> => {
    const data = await apiFetch<{ risks: RiskSummary[] }>("/agent/all-risks");
    return data.risks;
  },
  getProductRisk: (productId: string) =>
    apiFetch<ProductRisk>(`/agent/product-risk/${productId}`),
};

// ─── Inventory API ────────────────────────────────────────────────────────────

export const inventoryApi = {
  getAll: async (): Promise<InventoryItem[]> => {
    const data = await apiFetch<{ inventory: InventoryItem[] }>("/inventory");
    return data.inventory;
  },
};

// ─── Agent API (Orchestrator-driven) ─────────────────────────────────────────

export const agentApi = {
  analyzeProduct: (req: AgentRequest) =>
    apiFetch<AgentAnalysisResult>("/agent/analyze-product", {
      method: "POST",
      body: JSON.stringify(req),
    }),

  generateActionPlan: (req: AgentRequest) =>
    apiFetch<{ action_plan: AgentAnalysisResult["action_plan"]; summary: string; agents_used: string[] }>(
      "/agent/generate-action-plan",
      { method: "POST", body: JSON.stringify(req) }
    ),
};
