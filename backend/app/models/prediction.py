import uuid
from sqlalchemy import Column, String, Float, Integer, Date, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class DemandPrediction(Base):
    __tablename__ = "demand_predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    food_item_id = Column(String(36), ForeignKey("food_items.id", ondelete="CASCADE"), nullable=True, index=True)
    prediction_date = Column(Date, nullable=False, index=True)
    day_of_week = Column(String(20), nullable=False)
    predicted_demand = Column(Integer, nullable=False)
    recommended_prep = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    expected_waste = Column(Integer, default=0, nullable=False)
    shortage_risk = Column(String(20), default="Low", nullable=False)
    weather_condition = Column(String(50), nullable=True)
    rain_probability = Column(Integer, nullable=True)
    factors = Column(JSON, default=list, nullable=False)
    explanation = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship
    food_item = relationship("FoodItem", back_populates="demand_predictions")
