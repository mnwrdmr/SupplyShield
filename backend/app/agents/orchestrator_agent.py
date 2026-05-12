from app.models.product import Product
from app.models.agent import AgentAnalysisResult
from app.agents.inventory_analyst import InventoryAnalystAgent
from app.agents.demand_forecast_agent import DemandForecastAgent
from app.agents.supply_shield_agent import SupplyShieldAgent
from app.agents.mesh_finder_agent import MeshFinderAgent
from app.agents.supplier_scout_agent import SupplierScoutAgent
from app.agents.logistics_planner_agent import LogisticsPlannerAgent
from app.agents.action_composer_agent import ActionComposerAgent


class OrchestratorAgent:
    """
    Master coordinator that runs all specialist agents in sequence,
    synthesises their outputs, and returns a unified analysis result.
    """

    name = "OrchestratorAgent"

    def __init__(self):
        self.inventory_analyst = InventoryAnalystAgent()
        self.demand_forecast = DemandForecastAgent()
        self.supply_shield = SupplyShieldAgent()
        self.mesh_finder = MeshFinderAgent()
        self.supplier_scout = SupplierScoutAgent()
        self.logistics_planner = LogisticsPlannerAgent()
        self.action_composer = ActionComposerAgent()

    def analyze(self, product: Product, analysis_depth: str = "full") -> AgentAnalysisResult:
        agents_used = []

        # Step 1: Inventory analysis
        inv_result = self.inventory_analyst.run(product)
        risk_analysis = inv_result["risk_analysis"]
        agents_used.append(InventoryAnalystAgent.name)

        # Step 2: Demand forecast
        demand_result = self.demand_forecast.run(product)
        forecast = demand_result["demand_forecast"]
        agents_used.append(DemandForecastAgent.name)

        # Step 3: Supply shield
        shield_result = self.supply_shield.run(product, risk_analysis)
        agents_used.append(SupplyShieldAgent.name)

        if analysis_depth == "full":
            # Step 4a: Mesh finder (existing network)
            mesh_result = self.mesh_finder.run(product)
            agents_used.append(MeshFinderAgent.name)

            # Step 4b: Supplier scout (new candidates)
            scout_result = self.supplier_scout.run(product)
            agents_used.append(SupplierScoutAgent.name)

            # Merge alternatives
            all_alternatives = mesh_result["alternatives"] + scout_result["scouted_suppliers"]
        else:
            mesh_result = self.mesh_finder.run(product)
            all_alternatives = mesh_result["alternatives"]
            agents_used.append(MeshFinderAgent.name)

        # Step 5: Logistics planning
        logistics_result = self.logistics_planner.run(product, forecast, risk_analysis.risk_score)
        logistics_plan = logistics_result["logistics_plan"]
        agents_used.append(LogisticsPlannerAgent.name)

        # Step 6: Action composition
        action_plan = self.action_composer.run(
            product=product,
            risk_analysis=risk_analysis,
            logistics_plan=logistics_plan,
            alternatives=all_alternatives,
            shield_warnings=shield_result["shield_warnings"],
            urgency_level=logistics_result["urgency_level"],
        )
        agents_used.append(ActionComposerAgent.name)

        # Orchestrator summary
        risk_emoji = "🔴" if risk_analysis.risk_score >= 75 else ("🟡" if risk_analysis.risk_score >= 50 else "🟢")
        summary = (
            f"SupplyShield analysis for {product.name} completed. "
            f"Risk Score: {risk_analysis.risk_score}/100 ({risk_analysis.risk_level.upper()}). "
            f"Demand forecast shows {forecast.trend} trend over {forecast.forecast_horizon_days} days. "
            f"{len(all_alternatives)} alternative suppliers identified. "
            f"Recommended action: {action_plan[0].title if action_plan else 'No immediate action required'}. "
            f"{len(action_plan)} total actions in plan. "
            f"Compound supply risk: {shield_result['compound_supply_risk']:.0%}."
        )

        return AgentAnalysisResult(
            product_id=product.id,
            product_name=product.name,
            risk_analysis=risk_analysis,
            demand_forecast=forecast,
            supplier_alternatives=all_alternatives,
            logistics_plan=logistics_plan,
            action_plan=action_plan,
            orchestrator_summary=summary,
            agents_used=agents_used,
        )
