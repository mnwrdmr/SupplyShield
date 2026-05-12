from fastapi import APIRouter
from app.data.mock_products import MOCK_PRODUCTS, MOCK_SUPPLIERS
from app.services.risk_calculator import calculate_risk_score

router = APIRouter()


@router.get("/dashboard/summary")
async def get_dashboard_summary():
    risk_scores = [calculate_risk_score(p) for p in MOCK_PRODUCTS]
    at_risk = sum(1 for s in risk_scores if s >= 50)
    critical = sum(1 for s in risk_scores if s >= 75)
    avg_risk = round(sum(risk_scores) / len(risk_scores), 1)
    total_value = sum(p.current_stock * p.unit_cost for p in MOCK_PRODUCTS)
    suppliers_at_risk = sum(1 for s in MOCK_SUPPLIERS.values() if s["risk"] in ("high",))

    return {
        "total_products": len(MOCK_PRODUCTS),
        "at_risk_products": at_risk,
        "critical_products": critical,
        "avg_risk_score": avg_risk,
        "total_inventory_value": round(total_value, 2),
        "suppliers_at_risk": suppliers_at_risk,
        "forecast_accuracy": 87.4,
    }
