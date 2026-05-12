from pydantic import BaseModel
from typing import Optional
from enum import Enum


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class Product(BaseModel):
    id: str
    name: str
    category: str
    sku: str
    current_stock: int
    reorder_point: int
    lead_time_days: int
    supplier_id: str
    supplier_name: str
    unit_cost: float
    selling_price: float
    avg_daily_demand: float
    demand_variability: float
    supplier_reliability: float  # 0-1
    country_of_origin: str


class InventoryItem(BaseModel):
    product_id: str
    product_name: str
    current_stock: int
    reorder_point: int
    days_of_supply: float
    status: str  # "ok", "warning", "critical"
    last_updated: str


class DashboardSummary(BaseModel):
    total_products: int
    at_risk_products: int
    critical_products: int
    avg_risk_score: float
    total_inventory_value: float
    suppliers_at_risk: int
    forecast_accuracy: float
