from typing import Optional
from pydantic import BaseModel, Field


class WeatherResponse(BaseModel):
    city: str
    weather_condition: str
    temperature: float
    rain_probability: int
    humidity: int
    description: Optional[str] = None
    is_available: bool = True
    error_reason: Optional[str] = None


class HolidayItem(BaseModel):
    date: str
    local_name: str
    name: str
    country_code: str
    fixed: bool = True
    global_holiday: Optional[bool] = Field(True, alias="global")
    types: Optional[list[str]] = []


class HolidayResponse(BaseModel):
    year: int
    country_code: str
    holidays: list[HolidayItem]
    count: int
    is_available: bool = True
    error_reason: Optional[str] = None


class HolidayCheckResponse(BaseModel):
    date: str
    is_holiday: bool
    holiday_name: Optional[str] = None
    is_available: bool = True
    error_reason: Optional[str] = None
