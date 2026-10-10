from typing import Optional
from fastapi import APIRouter, Depends, Query, status

from app.core.security import get_current_user
from app.schemas.external_services import WeatherResponse
from app.services.weather_service import weather_service

router = APIRouter()


@router.get("", response_model=WeatherResponse, status_code=status.HTTP_200_OK)
def get_weather(
    city: Optional[str] = Query(None, description="City name to fetch weather for"),
    lat: Optional[float] = Query(None, description="Latitude coordinate"),
    lon: Optional[float] = Query(None, description="Longitude coordinate"),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve current weather telemetry including temperature and rain probability.
    Gracefully handles API key absence, timeouts, rate limits, and provider failures.
    """
    data = weather_service.get_current_weather(city=city, lat=lat, lon=lon)
    return data
