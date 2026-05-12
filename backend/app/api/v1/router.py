from fastapi import APIRouter
from app.api.v1.endpoints import health, products, inventory, dashboard, agent, auth

api_router = APIRouter()

api_router.include_router(health.router, tags=["Health"])
api_router.include_router(products.router, prefix="/api/v1", tags=["Products"])
api_router.include_router(inventory.router, prefix="/api/v1", tags=["Inventory"])
api_router.include_router(dashboard.router, prefix="/api/v1", tags=["Dashboard"])
api_router.include_router(agent.router, prefix="/api/v1", tags=["Agent"])
api_router.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
