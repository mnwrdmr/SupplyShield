from app.models.product import Product
from app.models.agent import SupplierAlternative


class SupplierScoutAgent:
    """
    Scouts and scores potential new suppliers based on product category,
    cost tolerance, and lead-time requirements.
    """

    name = "SupplierScoutAgent"

    CATEGORY_SCOUTS = {
        "Electronics": [
            SupplierAlternative(
                supplier_id="SCOUT_E1", supplier_name="AsiaElec Partners", country="Malaysia",
                lead_time_days=16, estimated_cost_change_pct=4.0, reliability_score=0.89,
                match_score=0.83, notes="Specialises in consumer electronics, JIT capable",
            ),
        ],
        "Accessories": [
            SupplierAlternative(
                supplier_id="SCOUT_A1", supplier_name="EuroAccess GmbH", country="Poland",
                lead_time_days=12, estimated_cost_change_pct=10.0, reliability_score=0.92,
                match_score=0.80, notes="EU-based, low tariff risk, strong QC",
            ),
        ],
        "Peripherals": [
            SupplierAlternative(
                supplier_id="SCOUT_P1", supplier_name="TaiPeri Co.", country="Taiwan",
                lead_time_days=14, estimated_cost_change_pct=2.0, reliability_score=0.87,
                match_score=0.88, notes="Strong peripheral expertise, competitive pricing",
            ),
        ],
        "Storage": [
            SupplierAlternative(
                supplier_id="SCOUT_S1", supplier_name="FlashTech Korea", country="South Korea",
                lead_time_days=10, estimated_cost_change_pct=-2.0, reliability_score=0.94,
                match_score=0.91, notes="Industry-leading NAND flash supplier",
            ),
        ],
    }

    def run(self, product: Product) -> dict:
        candidates = self.CATEGORY_SCOUTS.get(
            product.category,
            [SupplierAlternative(
                supplier_id="SCOUT_GEN", supplier_name="Global Trade Hub",
                country="Singapore", lead_time_days=18, estimated_cost_change_pct=6.0,
                reliability_score=0.80, match_score=0.72,
                notes="General trading company, broad sourcing capability",
            )]
        )

        # Filter out candidates worse than current supplier
        qualified = [c for c in candidates if c.reliability_score > product.supplier_reliability * 0.9]
        if not qualified:
            qualified = candidates

        return {
            "agent": self.name,
            "scouted_suppliers": qualified,
            "best_candidate": max(qualified, key=lambda s: s.match_score),
            "qualification_criteria": {
                "min_reliability": product.supplier_reliability * 0.9,
                "max_lead_time": product.lead_time_days + 10,
                "category": product.category,
            },
        }
