from fastapi import APIRouter, HTTPException
from app.data.mock_products import MOCK_PRODUCTS

router = APIRouter()


@router.get("/products")
async def get_products():
    return {"products": [p.model_dump() for p in MOCK_PRODUCTS], "total": len(MOCK_PRODUCTS)}


@router.get("/products/{product_id}")
async def get_product(product_id: str):
    product = next((p for p in MOCK_PRODUCTS if p.id == product_id), None)
    if not product:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    return product.model_dump()
