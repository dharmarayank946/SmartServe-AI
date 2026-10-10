import uuid
from sqlalchemy import Column, String, Float, Date, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class WasteLog(Base):
    __tablename__ = "waste_logs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    food_item_id = Column(String(36), ForeignKey("food_items.id", ondelete="CASCADE"), nullable=True, index=True)
    item_name = Column(String(100), nullable=False)
    date = Column(Date, nullable=False, index=True)
    time = Column(String(10), nullable=True)
    quantity = Column(Float, nullable=False)
    unit = Column(String(30), nullable=False, default="portions")
    reason = Column(String(100), nullable=False, index=True)
    financial_loss = Column(Float, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    food_item = relationship("FoodItem", back_populates="waste_logs")
