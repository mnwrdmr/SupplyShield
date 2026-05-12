from app.models.product import Product
from app.data.mock_products import ALTERNATIVE_SUPPLIERS
from app.models.agent import SupplierAlternative


class MeshFinderAgent:
    """
    Finds alternative supplier network paths (mesh) that can fulfill
    demand if the primary supplier is disrupted.
    """

    name = "MeshFinderAgent"

    def run(self, product: Product) -> dict:
        alternatives_raw = ALTERNATIVE_SUPPLIERS.get(product.supplier_id, [])

        alternatives = [SupplierAlternative(**a) for a in alternatives_raw]

        # If no pre-defined alternatives, generate generic ones
        if not alternatives:
            alternatives = [
                SupplierAlternative(
                    supplier_id="ALT_GEN_01",
                    supplier_name="Global Parts Network",
                    country="Multiple",
                    lead_time_days=product.lead_time_days + 5,
                    estimated_cost_change_pct=8.0,
                    reliability_score=0.82,
                    match_score=0.70,
                    notes="Broker network — can source from multiple origins",
                )
            ]

        best = max(alternatives, key=lambda a: a.match_score)
        return {
            "agent": self.name,
            "alternatives": alternatives,
            "recommended_alternative": best,
            "mesh_coverage": len(alternatives),
            "avg_lead_time_delta": round(
                sum(a.lead_time_days - product.lead_time_days for a in alternatives) / len(alternatives), 1
            ),
        }
