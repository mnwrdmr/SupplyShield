import math
from datetime import date, timedelta
from app.models.product import Product
from app.models.agent import LogisticsPlan, DemandForecast


class LogisticsPlannerAgent:
    """
    Calculates optimal order quantities, timing, and shipping methods
    using EOQ principles adjusted for risk posture.
    """

    name = "LogisticsPlannerAgent"

    SHIPPING_OPTIONS = {
        "air": {"days_factor": 0.3, "cost_multiplier": 4.5},
        "sea": {"days_factor": 1.0, "cost_multiplier": 1.0},
        "rail": {"days_factor": 0.7, "cost_multiplier": 1.8},
        "express_courier": {"days_factor": 0.15, "cost_multiplier": 7.0},
    }

    def _eoq(self, annual_demand: float, order_cost: float, holding_cost_per_unit: float) -> int:
        if holding_cost_per_unit <= 0:
            return int(annual_demand / 12)
        return int(math.sqrt((2 * annual_demand * order_cost) / holding_cost_per_unit))

    def run(self, product: Product, forecast: DemandForecast, risk_score: float) -> dict:
        annual_demand = product.avg_daily_demand * 365
        order_cost = product.unit_cost * 0.05  # 5% of unit cost
        holding_cost = product.unit_cost * 0.20  # 20% annual holding

        eoq = self._eoq(annual_demand, order_cost, holding_cost)

        # Adjust for risk: higher risk → larger safety buffer
        risk_buffer = 1.0 + (risk_score / 100) * 0.5
        recommended_qty = max(int(eoq * risk_buffer), product.reorder_point)

        # Determine urgency and shipping method
        days_of_supply = product.current_stock / max(product.avg_daily_demand, 0.01)
        if days_of_supply < 7:
            method = "express_courier"
        elif days_of_supply < product.lead_time_days:
            method = "air"
        elif risk_score >= 60:
            method = "rail"
        else:
            method = "sea"

        shipping = self.SHIPPING_OPTIONS[method]
        effective_lead = int(product.lead_time_days * shipping["days_factor"])
        order_date = date.today()
        arrival_date = order_date + timedelta(days=effective_lead)

        base_shipping_cost = recommended_qty * product.unit_cost * 0.03
        total_shipping = base_shipping_cost * shipping["cost_multiplier"]

        return {
            "agent": self.name,
            "logistics_plan": LogisticsPlan(
                recommended_order_qty=recommended_qty,
                recommended_order_date=order_date.isoformat(),
                estimated_arrival_date=arrival_date.isoformat(),
                shipping_method=method,
                estimated_cost=round(total_shipping, 2),
                notes=(
                    f"EOQ base: {eoq} units, risk-adjusted to {recommended_qty}. "
                    f"{method.replace('_', ' ').title()} shipping selected based on "
                    f"{days_of_supply:.1f} days remaining supply."
                ),
            ),
            "eoq": eoq,
            "days_of_supply": round(days_of_supply, 1),
            "urgency_level": "critical" if days_of_supply < 7 else ("high" if days_of_supply < product.lead_time_days else "normal"),
        }
