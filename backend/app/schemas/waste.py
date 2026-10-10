from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field


class WasteLogBase(BaseModel):
    food_item_id: Optional[str] = None
    item_name: str = Field(..., min_length=1, max_length=100)
    date: date
    time: Optional[str] = None
    quantity: float = Field(..., ge=0.0)
    unit: str = Field("portions", min_length=1)
    reason: str = Field(..., min_length=1, max_length=100)
    financial_loss: float = Field(..., ge=0.0)
    notes: Optional[str] = None


class WasteLogCreate(WasteLogBase):
    pass


class WasteLogResponse(WasteLogBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
