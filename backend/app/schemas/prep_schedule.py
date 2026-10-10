from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class PreparationBatchBase(BaseModel):
    food_item_id: Optional[str] = None
    batch_size: int
    prepare_time: str
    status: Optional[str] = "Scheduled"
    station: Optional[str] = "Station A"
    date: date


class PreparationBatchCreate(PreparationBatchBase):
    pass


class PreparationBatchUpdate(BaseModel):
    batch_size: Optional[int] = None
    prepare_time: Optional[str] = None
    status: Optional[str] = None
    station: Optional[str] = None


class PreparationBatchResponse(PreparationBatchBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
