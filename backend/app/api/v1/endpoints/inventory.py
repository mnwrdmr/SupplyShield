from fastapi import APIRouter
from datetime import datetime
from app.data.mock_products import MOCK_PRODUCTS

router = APIRouter()


def _days_of_supply(stock: int, daily_demand: float) -> float:
    if daily_demand <= 0:
        return 999.0
    return round(stock / daily_demand, 1)


def _inventory_status(stock: int, reorder_point: int, days: float) -> str:
    if stock <= 0:
        return "stockout"
    if stock < reorder_point * 0.5 or days < 5:
        return "critical"
    if stock < reorder_point or days < 14:
        return "warning"
    return "ok"


@router.get("/inventory")
async def get_inventory():
    now = datetime.utcnow().isoformat()
    items = []
    for p in MOCK_PRODUCTS:
        days = _days_of_supply(p.current_stock, p.avg_daily_demand)
        items.append({
            "product_id": p.id,
            "product_name": p.name,
            "sku": p.sku,
            "current_stock": p.current_stock,
            "reorder_point": p.reorder_point,
            "days_of_supply": days,
            "status": _inventory_status(p.current_stock, p.reorder_point, days),
            "last_updated": now,
        })
    return {"inventory": items, "as_of": now}
