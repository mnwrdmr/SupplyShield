from datetime import date, timedelta
from app.models.product import Product
from app.models.agent import ActionItem, LogisticsPlan, SupplierAlternative, RiskAnalysis


class ActionComposerAgent:
    """Synthesizes all agent outputs into a prioritised action plan."""

    name = "ActionComposerAgent"

    def run(
        self,
        product: Product,
        risk_analysis: RiskAnalysis,
        logistics_plan: LogisticsPlan,
        alternatives: list[SupplierAlternative],
        shield_warnings: list[str],
        urgency_level: str,
    ) -> list[ActionItem]:
        actions: list[ActionItem] = []
        priority = 1

        # Action 1: Immediate order if stock is critical
        if urgency_level in ("critical", "high"):
            deadline = (date.today() + timedelta(days=2)).isoformat() if urgency_level == "critical" else (date.today() + timedelta(days=7)).isoformat()
            actions.append(ActionItem(
                priority=priority,
                action_type="order",
                title=f"Place Emergency Order — {product.name}",
                description=(
                    f"Order {logistics_plan.recommended_order_qty} units via "
                    f"{logistics_plan.shipping_method.replace('_', ' ').title()} "
                    f"(ETA: {logistics_plan.estimated_arrival_date}). "
                    f"Estimated cost: ${logistics_plan.estimated_cost:,.0f}."
                ),
                estimated_impact=f"Prevents stockout risk within {product.lead_time_days} days",
                deadline=deadline,
            ))
            priority += 1

        # Action 2: Supplier switch if reliability is low
        if product.supplier_reliability < 0.80 and alternatives:
            best_alt = max(alternatives, key=lambda a: a.match_score)
            actions.append(ActionItem(
                priority=priority,
                action_type="switch_supplier",
                title=f"Qualify Alternative Supplier — {best_alt.supplier_name}",
                description=(
                    f"Initiate qualification for {best_alt.supplier_name} ({best_alt.country}). "
                    f"Match score: {best_alt.match_score:.0%}, reliability: {best_alt.reliability_score:.0%}. "
                    f"Estimated cost delta: {best_alt.estimated_cost_change_pct:+.1f}%."
                ),
                estimated_impact="Reduces supplier concentration risk by 40-60%",
                deadline=(date.today() + timedelta(days=30)).isoformat(),
            ))
            priority += 1

        # Action 3: Expedite if medium risk
        if risk_analysis.risk_score >= 50 and urgency_level == "normal":
            actions.append(ActionItem(
                priority=priority,
                action_type="expedite",
                title=f"Expedite Existing Orders — {product.name}",
                description=(
                    f"Contact {product.supplier_name} to expedite any open POs. "
                    f"Risk score {risk_analysis.risk_score}/100 warrants proactive action."
                ),
                estimated_impact="Reduces lead time exposure by up to 30%",
                deadline=(date.today() + timedelta(days=5)).isoformat(),
            ))
            priority += 1

        # Action 4: Monitor for remaining risks
        if shield_warnings:
            actions.append(ActionItem(
                priority=priority,
                action_type="monitor",
                title=f"Enable Supply Shield Monitoring — {product.name}",
                description=(
                    f"Set automated alerts for: {'; '.join(shield_warnings[:2])}. "
                    f"Review weekly or upon supplier disruption signals."
                ),
                estimated_impact="Early warning system reduces disruption impact by 25%",
                deadline=None,
            ))

        return actions
