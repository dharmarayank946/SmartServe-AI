import uuid
from sqlalchemy import Column, String, Integer, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PreparationBatch(Base):
    __tablename__ = "preparation_batches"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    food_item_id = Column(String(36), ForeignKey("food_items.id", ondelete="CASCADE"), nullable=True, index=True)
    batch_size = Column(Integer, nullable=False)
    prepare_time = Column(String(20), nullable=False)
    status = Column(String(30), default="Scheduled", nullable=False)
    station = Column(String(50), default="Station A", nullable=False)
    date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    food_item = relationship("FoodItem", back_populates="preparation_batches")
