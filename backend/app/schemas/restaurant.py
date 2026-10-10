from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class RestaurantConfigBase(BaseModel):
    branch_id: str = "HYD-BLR-04"
    name: str = "SmartServe Grand Bistro"
    cuisine: Optional[str] = "Multi-Cuisine & Fine Dining"
    capacity_seats: Optional[int] = 120
    avg_daily_orders: Optional[int] = 540
    ai_prep_safety_buffer_percent: Optional[float] = 6.0
    waste_threshold_alert_kg: Optional[float] = 10.0
    currency_symbol: Optional[str] = "₹"


class RestaurantConfigUpdate(BaseModel):
    name: Optional[str] = None
    cuisine: Optional[str] = None
    capacity_seats: Optional[int] = None
    avg_daily_orders: Optional[int] = None
    ai_prep_safety_buffer_percent: Optional[float] = None
    waste_threshold_alert_kg: Optional[float] = None
    currency_symbol: Optional[str] = None


class RestaurantConfigResponse(RestaurantConfigBase):
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
