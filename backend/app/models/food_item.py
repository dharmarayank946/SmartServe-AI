import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, JSON, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class FoodItem(Base):
    __tablename__ = "food_items"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False, index=True)
    category = Column(String(50), nullable=False, index=True)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=False)
    avg_daily_sales = Column(Integer, default=0, nullable=False)
    current_stock = Column(Integer, default=0, nullable=False)
    unit = Column(String(30), default="portions", nullable=False)
    lead_time_hours = Column(Float, default=1.0, nullable=False)
    shelf_life_days = Column(Integer, default=1, nullable=False)
    ai_optimized = Column(Boolean, default=True, nullable=False)
    image_url = Column(String(500), nullable=True)
    tags = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    sales_records = relationship("SalesRecord", back_populates="food_item", cascade="all, delete-orphan")
    waste_logs = relationship("WasteLog", back_populates="food_item", cascade="all, delete-orphan")
    demand_predictions = relationship("DemandPrediction", back_populates="food_item", cascade="all, delete-orphan")
    preparation_batches = relationship("PreparationBatch", back_populates="food_item", cascade="all, delete-orphan")
