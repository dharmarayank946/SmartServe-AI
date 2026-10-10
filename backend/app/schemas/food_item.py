from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field, AliasChoices


class FoodItemBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    category: str = Field(..., min_length=1, max_length=50)
    price: float = Field(..., ge=0.0)
    cost: float = Field(..., ge=0.0)
    avg_daily_sales: Optional[int] = Field(0, ge=0, validation_alias=AliasChoices("avgDailySales", "avg_daily_sales"))
    current_stock: Optional[int] = Field(0, ge=0, validation_alias=AliasChoices("currentStock", "current_stock"))
    unit: Optional[str] = "portions"
    lead_time_hours: Optional[float] = Field(1.0, ge=0.0, validation_alias=AliasChoices("leadTimeHours", "lead_time_hours"))
    shelf_life_days: Optional[int] = Field(1, ge=0, validation_alias=AliasChoices("shelfLifeDays", "shelf_life_days"))
    ai_optimized: Optional[bool] = Field(True, validation_alias=AliasChoices("aiOptimized", "ai_optimized"))
    image_url: Optional[str] = Field(None, validation_alias=AliasChoices("imageUrl", "image_url", "image"))
    tags: Optional[List[str]] = []

    model_config = ConfigDict(populate_by_name=True)


class FoodItemCreate(FoodItemBase):
    pass


class FoodItemUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    category: Optional[str] = Field(None, min_length=1, max_length=50)
    price: Optional[float] = Field(None, ge=0.0)
    cost: Optional[float] = Field(None, ge=0.0)
    avg_daily_sales: Optional[int] = Field(None, ge=0, validation_alias=AliasChoices("avgDailySales", "avg_daily_sales"))
    current_stock: Optional[int] = Field(None, ge=0, validation_alias=AliasChoices("currentStock", "current_stock"))
    unit: Optional[str] = None
    lead_time_hours: Optional[float] = Field(None, ge=0.0, validation_alias=AliasChoices("leadTimeHours", "lead_time_hours"))
    shelf_life_days: Optional[int] = Field(None, ge=0, validation_alias=AliasChoices("shelfLifeDays", "shelf_life_days"))
    ai_optimized: Optional[bool] = None
    image_url: Optional[str] = Field(None, validation_alias=AliasChoices("imageUrl", "image_url", "image"))
    tags: Optional[List[str]] = None

    model_config = ConfigDict(populate_by_name=True)


class FoodItemResponse(FoodItemBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True, populate_by_name=True)
