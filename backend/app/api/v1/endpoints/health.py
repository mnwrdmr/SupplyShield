from fastapi import APIRouter
from datetime import datetime

router = APIRouter()


@router.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "SupplyShield API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
    }
