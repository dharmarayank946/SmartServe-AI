from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import uuid

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.food_item import FoodItem
from app.schemas.food_item import FoodItemCreate, FoodItemUpdate, FoodItemResponse

router = APIRouter()


def _format_food_item_response(item: FoodItem) -> dict:
    """Format FoodItem ORM object into dictionary matching frontend expectations."""
    return {
        "id": item.id,
        "name": item.name,
        "category": item.category,
        "price": item.price,
        "cost": item.cost,
        "avgDailySales": item.avg_daily_sales,
        "currentStock": item.current_stock,
        "unit": item.unit,
        "leadTimeHours": item.lead_time_hours,
        "shelfLifeDays": item.shelf_life_days,
        "aiOptimized": item.ai_optimized,
        "image": item.image_url,
        "image_url": item.image_url,
        "tags": item.tags or [],
        "created_at": item.created_at.isoformat() if item.created_at else None,
    }


@router.get("", response_model=List[dict])
def get_food_items(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Retrieve all food items with optional filtering by category and keyword search.
    """
    try:
        query = db.query(FoodItem)
        if category and category != "All":
            query = query.filter(FoodItem.category == category)
        if search:
            query = query.filter(FoodItem.name.ilike(f"%{search}%"))

        items = query.order_by(FoodItem.name.asc()).offset(skip).limit(limit).all()
        return [_format_food_item_response(item) for item in items]
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error retrieving food items: {str(e)}",
        )


@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def create_food_item(
    item_in: FoodItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new food item in inventory.
    """
    try:
        item = FoodItem(
            id=f"item-{str(uuid.uuid4())[:8]}",
            name=item_in.name,
            category=item_in.category,
            price=item_in.price,
            cost=item_in.cost,
            avg_daily_sales=item_in.avg_daily_sales or 0,
            current_stock=item_in.current_stock or 0,
            unit=item_in.unit or "portions",
            lead_time_hours=item_in.lead_time_hours or 1.0,
            shelf_life_days=item_in.shelf_life_days or 1,
            ai_optimized=item_in.ai_optimized if item_in.ai_optimized is not None else True,
            image_url=item_in.image_url,
            tags=item_in.tags or [],
        )
        db.add(item)
        db.commit()
        db.refresh(item)
        return _format_food_item_response(item)
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error creating food item: {str(e)}",
        )


@router.put("/{item_id}", response_model=dict)
def update_food_item(
    item_id: str,
    item_in: FoodItemUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Update an existing food item by ID.
    """
    try:
        item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item '{item_id}' not found",
            )

        update_data = item_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            if field == "image_url":
                setattr(item, "image_url", value)
            elif hasattr(item, field):
                setattr(item, field, value)

        db.commit()
        db.refresh(item)
        return _format_food_item_response(item)
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error updating food item: {str(e)}",
        )


@router.delete("/{item_id}", status_code=status.HTTP_200_OK)
def delete_food_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """
    Delete a food item by ID.
    """
    try:
        item = db.query(FoodItem).filter(FoodItem.id == item_id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Food item '{item_id}' not found",
            )

        db.delete(item)
        db.commit()
        return {"success": True, "message": f"Food item '{item_id}' deleted successfully"}
    except HTTPException:
        raise
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error deleting food item: {str(e)}",
        )
