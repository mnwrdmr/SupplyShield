// ─── Enums ────────────────────────────────────────────────────────────────────

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type InventoryStatus = "ok" | "warning" | "critical" | "stockout";
export type TrendDirection = "increasing" | "decreasing" | "stable";
export type ActionType = "order" | "switch_supplier" | "expedite" | "monitor";
export type ShippingMethod = "air" | "sea" | "rail" | "express_courier";

// ─── Domain Models ────────────────────────────────────────────────────────────

export interface DashboardSummary {
  total_products: number;
  at_risk_products: number;
  critical_products: number;
  avg_risk_score: number;
  total_inventory_value: number;
  suppliers_at_risk: number;
  forecast_accuracy: number;
}

export interface RiskSummary {
  product_id: string;
  product_name: string;
  category: string;
  risk_score: number;
  risk_level: RiskLevel;
  supplier_name: string;
  current_stock: number;
  reorder_point: number;
}

export interface RiskFactor {
  factor: string;
  impact: "high" | "medium" | "low";
  description: string;
  value?: number;
}

export interface ProductRisk {
  product_id: string;
  product_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
}

export interface InventoryItem {
  product_id: string;
  product_name: string;
  sku: string;
  current_stock: number;
  reorder_point: number;
  days_of_supply: number;
  status: InventoryStatus;
  last_updated: string;
}

export interface ForecastPoint {
  date: string;
  predicted_demand: number;
  lower_bound: number;
  upper_bound: number;
}

export interface DemandForecast {
  product_id: string;
  trend: TrendDirection;
  points: ForecastPoint[];
  forecast_horizon_days: number;
  seasonality_detected: boolean;
}

export interface SupplierAlternative {
  supplier_id: string;
  supplier_name: string;
  country: string;
  lead_time_days: number;
  estimated_cost_change_pct: number;
  reliability_score: number;
  match_score: number;
  notes: string;
}

export interface LogisticsPlan {
  recommended_order_qty: number;
  recommended_order_date: string;
  estimated_arrival_date: string;
  shipping_method: ShippingMethod;
  estimated_cost: number;
  notes: string;
}

export interface ActionItem {
  priority: number;
  action_type: ActionType;
  title: string;
  description: string;
  estimated_impact: string;
  deadline?: string;
}

export interface RiskAnalysisResult {
  product_id: string;
  product_name: string;
  risk_score: number;
  risk_level: RiskLevel;
  risk_factors: RiskFactor[];
  explanation: string;
  confidence: number;
}

export interface AgentAnalysisResult {
  product_id: string;
  product_name: string;
  risk_analysis: RiskAnalysisResult;
  demand_forecast: DemandForecast;
  supplier_alternatives: SupplierAlternative[];
  logistics_plan: LogisticsPlan;
  action_plan: ActionItem[];
  orchestrator_summary: string;
  agents_used: string[];
}

// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface AgentRequest {
  product_id: string;
  analysis_depth?: "quick" | "full";
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export type NavPage = "dashboard" | "risks" | "inventory" | "logistics" | "agents";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
