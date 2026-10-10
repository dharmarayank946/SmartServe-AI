from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class NotificationBase(BaseModel):
    type: str
    priority: str
    title: str
    time_label: Optional[str] = None
    reason: str
    recommended_action: str
    is_read: Optional[bool] = False


class NotificationCreate(NotificationBase):
    pass


class NotificationResponse(NotificationBase):
    id: str
    created_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)
