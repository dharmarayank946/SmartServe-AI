from sqlalchemy import Column, String, Float, Integer, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class RestaurantConfig(Base):
    __tablename__ = "restaurant_config"

    branch_id = Column(String(50), primary_key=True, default="HYD-BLR-04")
    name = Column(String(150), nullable=False)
    cuisine = Column(String(100), nullable=True)
    capacity_seats = Column(Integer, default=120, nullable=False)
    avg_daily_orders = Column(Integer, default=540, nullable=False)
    ai_prep_safety_buffer_percent = Column(Float, default=6.0, nullable=False)
    waste_threshold_alert_kg = Column(Float, default=10.0, nullable=False)
    currency_symbol = Column(String(10), default="₹", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
