from app.models.product import Product
from app.models.agent import RiskAnalysis


class SupplyShieldAgent:
    """
    Evaluates supply chain vulnerabilities — geopolitical, financial,
    single-source dependency, and capacity risks.
    """

    name = "SupplyShieldAgent"

    GEOPOLITICAL_RISK = {
        "China": 0.75, "Russia": 0.95, "Belarus": 0.90,
        "Taiwan": 0.60, "Vietnam": 0.30, "Mexico": 0.25,
        "Germany": 0.10, "Japan": 0.15, "South Korea": 0.35,
        "Indonesia": 0.28,
    }

    def run(self, product: Product, risk_analysis: RiskAnalysis) -> dict:
        geo_risk = self.GEOPOLITICAL_RISK.get(product.country_of_origin, 0.40)
        single_source_risk = 0.70 if product.supplier_reliability < 0.80 else 0.30

        # Capacity risk: how close are we to stockout under disruption?
        disruption_scenario_days = product.lead_time_days * 1.5
        disruption_demand = disruption_scenario_days * product.avg_daily_demand
        capacity_risk = min(1.0, max(0.0, (disruption_demand - product.current_stock) / max(disruption_demand, 1)))

        compound_risk = (geo_risk * 0.35 + single_source_risk * 0.35 + capacity_risk * 0.30)

        shield_warnings = []
        if geo_risk > 0.6:
            shield_warnings.append(f"HIGH geopolitical risk in {product.country_of_origin} ({geo_risk:.0%})")
        if single_source_risk > 0.5:
            shield_warnings.append(f"Single-source dependency risk — {product.supplier_name} reliability {product.supplier_reliability:.0%}")
        if capacity_risk > 0.5:
            shield_warnings.append(f"Disruption scenario shows {capacity_risk:.0%} capacity gap over {disruption_scenario_days:.0f} days")

        return {
            "agent": self.name,
            "geopolitical_risk": round(geo_risk, 3),
            "single_source_risk": round(single_source_risk, 3),
            "capacity_risk": round(capacity_risk, 3),
            "compound_supply_risk": round(compound_risk, 3),
            "shield_warnings": shield_warnings,
            "disruption_scenario_days": disruption_scenario_days,
        }
