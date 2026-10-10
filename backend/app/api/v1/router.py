from fastapi import APIRouter
from app.api.v1.endpoints import auth, food, sales, waste, dashboard, predictions, weather, holiday, ai, notifications

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(food.router, prefix="/food-items", tags=["Food Management"])
api_router.include_router(sales.router, prefix="/sales", tags=["Sales Telemetry"])
api_router.include_router(waste.router, prefix="/waste", tags=["Waste Tracking"])
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(predictions.router, prefix="/predict", tags=["ML Demand Prediction"])
api_router.include_router(predictions.router, prefix="/predictions", tags=["ML Demand Prediction"])
api_router.include_router(weather.router, prefix="/weather", tags=["Weather Telemetry"])
api_router.include_router(holiday.router, prefix="/holidays", tags=["Holiday Calendar"])
api_router.include_router(ai.router, prefix="/ai", tags=["AI Copilot & Control Room"])
api_router.include_router(notifications.router, prefix="/notifications", tags=["Operational Notifications"])
