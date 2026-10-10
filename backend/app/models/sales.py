import uuid
from sqlalchemy import Column, String, Float, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class SalesRecord(Base):
    __tablename__ = "sales_records"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    food_item_id = Column(String(36), ForeignKey("food_items.id", ondelete="CASCADE"), nullable=True, index=True)
    date = Column(Date, nullable=False, index=True)
    quantity_sold = Column(Integer, nullable=False)
    revenue = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    food_item = relationship("FoodItem", back_populates="sales_records")
