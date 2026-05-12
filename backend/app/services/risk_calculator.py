from app.models.product import Product
from app.models.agent import RiskFactor, RiskAnalysis


def calculate_risk_score(product: Product) -> float:
    """
    Weighted risk formula:
      - Stock coverage vs reorder point (30%)
      - Supplier reliability (25%)
      - Lead time exposure (20%)
      - Demand variability (15%)
      - Geographic concentration (10%)
    """
    # Stock coverage score (higher shortage → higher risk)
    coverage_ratio = product.current_stock / max(product.reorder_point, 1)
    stock_risk = max(0.0, min(1.0, 1.0 - (coverage_ratio / 2.0)))

    # Supplier reliability risk
    supplier_risk = 1.0 - product.supplier_reliability

    # Lead time risk (normalise to 0-1, 60 days cap)
    lead_risk = min(product.lead_time_days / 60.0, 1.0)

    # Demand variability already 0-1
    demand_risk = product.demand_variability

    # Geographic concentration
    HIGH_RISK_COUNTRIES = {"China", "Russia", "Belarus"}
    geo_risk = 0.8 if product.country_of_origin in HIGH_RISK_COUNTRIES else 0.2

    score = (
        stock_risk * 0.30
        + supplier_risk * 0.25
        + lead_risk * 0.20
        + demand_risk * 0.15
        + geo_risk * 0.10
    )
    return round(score * 100, 1)


def risk_level_from_score(score: float) -> str:
    if score >= 75:
        return "critical"
    if score >= 50:
        return "high"
    if score >= 25:
        return "medium"
    return "low"


def explain_risk(product: Product) -> list[RiskFactor]:
    factors: list[RiskFactor] = []

    coverage_ratio = product.current_stock / max(product.reorder_point, 1)
    if coverage_ratio < 0.5:
        factors.append(RiskFactor(
            factor="Stock Coverage",
            impact="high",
            description=f"Current stock ({product.current_stock} units) is critically below reorder point ({product.reorder_point} units).",
            value=round(coverage_ratio, 2),
        ))
    elif coverage_ratio < 1.0:
        factors.append(RiskFactor(
            factor="Stock Coverage",
            impact="medium",
            description=f"Stock is below reorder point. Coverage ratio: {coverage_ratio:.2f}.",
            value=round(coverage_ratio, 2),
        ))

    if product.supplier_reliability < 0.75:
        factors.append(RiskFactor(
            factor="Supplier Reliability",
            impact="high",
            description=f"{product.supplier_name} has a low reliability score of {product.supplier_reliability:.0%}.",
            value=product.supplier_reliability,
        ))

    if product.lead_time_days > 21:
        factors.append(RiskFactor(
            factor="Long Lead Time",
            impact="medium" if product.lead_time_days <= 30 else "high",
            description=f"Lead time of {product.lead_time_days} days limits response flexibility.",
            value=float(product.lead_time_days),
        ))

    if product.demand_variability > 0.3:
        factors.append(RiskFactor(
            factor="High Demand Variability",
            impact="medium",
            description=f"Demand variability of {product.demand_variability:.0%} makes forecasting difficult.",
            value=product.demand_variability,
        ))

    HIGH_RISK_COUNTRIES = {"China", "Russia", "Belarus"}
    if product.country_of_origin in HIGH_RISK_COUNTRIES:
        factors.append(RiskFactor(
            factor="Geographic Concentration",
            impact="high",
            description=f"Supplier located in {product.country_of_origin}, a high geopolitical risk region.",
            value=None,
        ))

    return factors
