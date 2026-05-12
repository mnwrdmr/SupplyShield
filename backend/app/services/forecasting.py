import math
import random
from datetime import date, timedelta
from app.models.agent import DemandForecast, ForecastPoint
from app.models.product import Product


def generate_demand_forecast(product: Product, horizon_days: int = 30) -> DemandForecast:
    """
    Simple exponential-smoothing-style forecast with seasonality noise.
    In production this would use a proper time-series model.
    """
    random.seed(hash(product.id) % 10000)

    base = product.avg_daily_demand
    variability = product.demand_variability
    today = date.today()

    # Determine trend from variability and stock signals
    if product.current_stock < product.reorder_point * 0.5:
        trend = "increasing"
        trend_factor = 1.02
    elif product.current_stock > product.reorder_point * 2:
        trend = "decreasing"
        trend_factor = 0.99
    else:
        trend = "stable"
        trend_factor = 1.0

    points: list[ForecastPoint] = []
    current_base = base
    for i in range(1, horizon_days + 1):
        current_base *= trend_factor
        # Add weekly seasonality (higher on weekdays)
        day_of_week = (today + timedelta(days=i)).weekday()
        seasonal_mult = 1.15 if day_of_week < 5 else 0.75

        predicted = current_base * seasonal_mult
        noise = variability * predicted
        lower = max(0.0, predicted - 1.5 * noise)
        upper = predicted + 1.5 * noise

        points.append(ForecastPoint(
            date=(today + timedelta(days=i)).isoformat(),
            predicted_demand=round(predicted, 2),
            lower_bound=round(lower, 2),
            upper_bound=round(upper, 2),
        ))

    return DemandForecast(
        product_id=product.id,
        forecast_horizon_days=horizon_days,
        points=points,
        trend=trend,
        seasonality_detected=True,
    )
