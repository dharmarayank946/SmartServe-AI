import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.sql import func
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="Restaurant Manager", nullable=False)
    branch_id = Column(String(50), default="HYD-BLR-04", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
