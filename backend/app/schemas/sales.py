from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class SalesRecordBase(BaseModel):
    food_item_id: Optional[str] = None
    date: date
    quantity_sold: int = Field(..., ge=0)
    revenue: float = Field(..., ge=0.0)


class SalesRecordCreate(SalesRecordBase):
    pass


class SalesRecordResponse(SalesRecordBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
