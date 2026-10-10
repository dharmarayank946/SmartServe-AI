import uuid
from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from app.core.database import Base


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    type = Column(String(30), nullable=False, index=True)
    priority = Column(String(20), nullable=False, index=True)
    title = Column(String(150), nullable=False)
    time_label = Column(String(50), nullable=True)
    reason = Column(Text, nullable=False)
    recommended_action = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
