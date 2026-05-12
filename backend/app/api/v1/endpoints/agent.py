from fastapi import APIRouter, HTTPException
from app.models.agent import AgentRequest, AgentAnalysisResult
from app.data.mock_products import MOCK_PRODUCTS
from app.agents.orchestrator_agent import OrchestratorAgent
from app.services.risk_calculator import calculate_risk_score, risk_level_from_score, explain_risk

router = APIRouter()
orchestrator = OrchestratorAgent()


@router.post("/agent/analyze-product", response_model=AgentAnalysisResult)
async def analyze_product(request: AgentRequest):
    product = next((p for p in MOCK_PRODUCTS if p.id == request.product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {request.product_id} not found")

    result = orchestrator.analyze(product, analysis_depth=request.analysis_depth or "full")
    return result


@router.post("/agent/generate-action-plan")
async def generate_action_plan(request: AgentRequest):
    product = next((p for p in MOCK_PRODUCTS if p.id == request.product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {request.product_id} not found")

    result = orchestrator.analyze(product, analysis_depth=request.analysis_depth or "full")
    return {
        "product_id": product.id,
        "product_name": product.name,
        "action_plan": [a.model_dump() for a in result.action_plan],
        "summary": result.orchestrator_summary,
        "agents_used": result.agents_used,
        "risk_score": result.risk_analysis.risk_score,
        "risk_level": result.risk_analysis.risk_level,
    }


@router.get("/agent/product-risk/{product_id}")
async def get_product_risk(product_id: str):
    product = next((p for p in MOCK_PRODUCTS if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")

    score = calculate_risk_score(product)
    level = risk_level_from_score(score)
    factors = explain_risk(product)

    return {
        "product_id": product.id,
        "product_name": product.name,
        "risk_score": score,
        "risk_level": level,
        "risk_factors": [f.model_dump() for f in factors],
    }


@router.get("/agent/all-risks")
async def get_all_risks():
    results = []
    for product in MOCK_PRODUCTS:
        score = calculate_risk_score(product)
        level = risk_level_from_score(score)
        results.append({
            "product_id": product.id,
            "product_name": product.name,
            "category": product.category,
            "risk_score": score,
            "risk_level": level,
            "supplier_name": product.supplier_name,
            "current_stock": product.current_stock,
            "reorder_point": product.reorder_point,
        })
    results.sort(key=lambda x: x["risk_score"], reverse=True)
    return {"risks": results}
