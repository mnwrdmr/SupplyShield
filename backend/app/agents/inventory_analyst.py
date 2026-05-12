from app.models.product import Product
from app.models.agent import RiskAnalysis
from app.services.risk_calculator import calculate_risk_score, risk_level_from_score, explain_risk


class InventoryAnalystAgent:
    """Analyzes current inventory position and generates risk context."""

    name = "InventoryAnalystAgent"

    def run(self, product: Product) -> dict:
        score = calculate_risk_score(product)
        level = risk_level_from_score(score)
        factors = explain_risk(product)

        days_of_supply = product.current_stock / max(product.avg_daily_demand, 0.01)
        stockout_risk_days = max(0, product.lead_time_days - days_of_supply)

        analysis = RiskAnalysis(
            product_id=product.id,
            product_name=product.name,
            risk_score=score,
            risk_level=level,
            risk_factors=factors,
            explanation=(
                f"{product.name} has a {level.upper()} risk score of {score}/100. "
                f"With {product.current_stock} units in stock and an average daily demand of "
                f"{product.avg_daily_demand} units, current days-of-supply is {days_of_supply:.1f} days. "
                f"Lead time is {product.lead_time_days} days, creating a potential stockout window of "
                f"{stockout_risk_days:.1f} days."
            ),
            confidence=0.88,
        )

        return {
            "agent": self.name,
            "risk_analysis": analysis,
            "days_of_supply": round(days_of_supply, 1),
            "stockout_risk_days": round(stockout_risk_days, 1),
        }
