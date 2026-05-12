from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class RiskFactor(BaseModel):
    factor: str
    impact: str  # "high", "medium", "low"
    description: str
    value: Optional[float] = None


class RiskAnalysis(BaseModel):
    product_id: str
    product_name: str
    risk_score: float  # 0-100
    risk_level: str
    risk_factors: List[RiskFactor]
    explanation: str
    confidence: float


class ForecastPoint(BaseModel):
    date: str
    predicted_demand: float
    lower_bound: float
    upper_bound: float


class DemandForecast(BaseModel):
    product_id: str
    forecast_horizon_days: int
    points: List[ForecastPoint]
    trend: str  # "increasing", "decreasing", "stable"
    seasonality_detected: bool


class SupplierAlternative(BaseModel):
    supplier_id: str
    supplier_name: str
    country: str
    lead_time_days: int
    estimated_cost_change_pct: float
    reliability_score: float
    match_score: float
    notes: str


class LogisticsPlan(BaseModel):
    recommended_order_qty: int
    recommended_order_date: str
    estimated_arrival_date: str
    shipping_method: str
    estimated_cost: float
    notes: str


class ActionItem(BaseModel):
    priority: int
    action_type: str  # "order", "switch_supplier", "expedite", "monitor"
    title: str
    description: str
    estimated_impact: str
    deadline: Optional[str] = None


class AgentAnalysisResult(BaseModel):
    product_id: str
    product_name: str
    risk_analysis: RiskAnalysis
    demand_forecast: DemandForecast
    supplier_alternatives: List[SupplierAlternative]
    logistics_plan: LogisticsPlan
    action_plan: List[ActionItem]
    orchestrator_summary: str
    agents_used: List[str]


class AgentRequest(BaseModel):
    product_id: str
    analysis_depth: Optional[str] = "full"  # "quick" | "full"
