from app.models.product import Product
from app.models.agent import DemandForecast
from app.services.forecasting import generate_demand_forecast


class DemandForecastAgent:
    """Generates demand forecasts and detects trend shifts."""

    name = "DemandForecastAgent"

    def run(self, product: Product, horizon_days: int = 30) -> dict:
        forecast = generate_demand_forecast(product, horizon_days)

        # Calculate expected demand over lead time (critical window)
        lead_time_demand = sum(
            p.predicted_demand for p in forecast.points[: product.lead_time_days]
        )
        safety_stock_needed = lead_time_demand * product.demand_variability * 1.65  # 95% service level

        return {
            "agent": self.name,
            "demand_forecast": forecast,
            "lead_time_demand": round(lead_time_demand, 1),
            "safety_stock_needed": round(safety_stock_needed, 1),
            "current_safety_buffer": max(0, product.current_stock - lead_time_demand),
        }
