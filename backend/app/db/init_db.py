from datetime import date, timedelta
from sqlalchemy.orm import Session
from app.core.security import get_password_hash
from app.models.user import User
from app.models.restaurant import RestaurantConfig
from app.models.food_item import FoodItem
from app.models.sales import SalesRecord
from app.models.waste import WasteLog
from app.models.prediction import DemandPrediction
from app.models.prep_schedule import PreparationBatch
from app.models.notification import Notification


def init_db(db: Session) -> None:
    """
    Seed initial development database with realistic telemetry data
    matching SmartServe AI commercial dataset.
    """
    # 1. Seed Restaurant Config
    existing_config = db.query(RestaurantConfig).filter_by(branch_id="HYD-BLR-04").first()
    if not existing_config:
        config = RestaurantConfig(
            branch_id="HYD-BLR-04",
            name="SmartServe Grand Bistro",
            cuisine="Multi-Cuisine & Fine Dining",
            capacity_seats=120,
            avg_daily_orders=540,
            ai_prep_safety_buffer_percent=6.0,
            waste_threshold_alert_kg=10.0,
            currency_symbol="₹"
        )
        db.add(config)

    # 2. Seed Admin / Manager User
    existing_user = db.query(User).filter_by(email="manager@smartserve.ai").first()
    if not existing_user:
        user = User(
            id="usr-mgr-001",
            name="SmartServe Manager",
            email="manager@smartserve.ai",
            password_hash=get_password_hash("password123"),
            role="Restaurant Manager",
            branch_id="HYD-BLR-04"
        )
        db.add(user)

    # 3. Seed Food Items
    food_items_data = [
        {
            "id": "item-001",
            "name": "Veg Biryani",
            "category": "Main Course",
            "price": 240.0,
            "cost": 85.0,
            "avg_daily_sales": 82,
            "current_stock": 90,
            "unit": "portions",
            "lead_time_hours": 1.5,
            "shelf_life_days": 1,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60",
            "tags": ["High Volume", "Peak Dinner"]
        },
        {
            "id": "item-002",
            "name": "Paneer Butter Masala",
            "category": "Main Course",
            "price": 280.0,
            "cost": 95.0,
            "avg_daily_sales": 64,
            "current_stock": 70,
            "unit": "portions",
            "lead_time_hours": 1.0,
            "shelf_life_days": 2,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=60",
            "tags": ["Bestseller", "High Margin"]
        },
        {
            "id": "item-003",
            "name": "Chicken Dum Biryani",
            "category": "Main Course",
            "price": 320.0,
            "cost": 120.0,
            "avg_daily_sales": 110,
            "current_stock": 125,
            "unit": "portions",
            "lead_time_hours": 2.0,
            "shelf_life_days": 1,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=500&auto=format&fit=crop&q=60",
            "tags": ["Weekend Spike", "Top Revenue"]
        },
        {
            "id": "item-004",
            "name": "Masala Dosa",
            "category": "Main Course",
            "price": 140.0,
            "cost": 35.0,
            "avg_daily_sales": 110,
            "current_stock": 115,
            "unit": "portions",
            "lead_time_hours": 0.2,
            "shelf_life_days": 1,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60",
            "tags": ["Breakfast Surge", "Fast Turnaround"]
        },
        {
            "id": "item-005",
            "name": "Cold Coffee",
            "category": "Beverages",
            "price": 130.0,
            "cost": 35.0,
            "avg_daily_sales": 45,
            "current_stock": 50,
            "unit": "glasses",
            "lead_time_hours": 0.2,
            "shelf_life_days": 1,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60",
            "tags": ["Weather Sensitive", "High Margin"]
        },
        {
            "id": "item-006",
            "name": "Fresh Garden Salad",
            "category": "Appetizers",
            "price": 150.0,
            "cost": 40.0,
            "avg_daily_sales": 30,
            "current_stock": 40,
            "unit": "bowls",
            "lead_time_hours": 0.5,
            "shelf_life_days": 1,
            "ai_optimized": True,
            "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
            "tags": ["High Waste Risk", "Perishable"]
        }
    ]

    for item_kwargs in food_items_data:
        if not db.query(FoodItem).filter_by(id=item_kwargs["id"]).first():
            db.add(FoodItem(**item_kwargs))

    db.commit()

    # 4. Seed Historical Sales Records
    today = date.today()
    if db.query(SalesRecord).count() == 0:
        sales_data = [
            {"offset": 6, "qty": 340, "rev": 48500.0},
            {"offset": 5, "qty": 380, "rev": 54200.0},
            {"offset": 4, "qty": 410, "rev": 58400.0},
            {"offset": 3, "qty": 440, "rev": 62800.0},
            {"offset": 2, "qty": 590, "rev": 84200.0},
            {"offset": 1, "qty": 680, "rev": 98600.0},
            {"offset": 0, "qty": 640, "rev": 91400.0},
        ]
        for idx, item in enumerate(sales_data):
            rec_date = today - timedelta(days=item["offset"])
            db.add(SalesRecord(
                id=f"sales-{idx+1}",
                food_item_id="item-001",
                date=rec_date,
                quantity_sold=item["qty"],
                revenue=item["rev"]
            ))

    # 5. Seed Waste Logs
    if db.query(WasteLog).count() == 0:
        waste_items = [
            {"id": "w-1", "item_id": "item-006", "name": "Fresh Garden Salad", "qty": 18, "unit": "bowls", "reason": "Over-preparation", "loss": 720.0, "time": "14:30"},
            {"id": "w-2", "item_id": "item-001", "name": "Veg Biryani (Night Batch)", "qty": 12, "unit": "portions", "reason": "Over-preparation", "loss": 1020.0, "time": "22:15"},
            {"id": "w-3", "item_id": "item-005", "name": "Cold Coffee Base", "qty": 8, "unit": "liters", "reason": "Ingredient Spoilage", "loss": 280.0, "time": "17:00"},
            {"id": "w-4", "item_id": None, "name": "Garlic Naan Dough", "qty": 15, "unit": "portions", "reason": "Plate Unconsumed", "loss": 225.0, "time": "21:30"}
        ]
        for w in waste_items:
            db.add(WasteLog(
                id=w["id"],
                food_item_id=w["item_id"],
                item_name=w["name"],
                date=today - timedelta(days=1),
                time=w["time"],
                quantity=w["qty"],
                unit=w["unit"],
                reason=w["reason"],
                financial_loss=w["loss"],
                notes="Standard daily waste audit entry."
            ))

    # 6. Seed Demand Predictions
    if db.query(DemandPrediction).count() == 0:
        predictions_data = [
            {
                "id": "pred-1",
                "food_item_id": "item-001",
                "prediction_date": today + timedelta(days=1),
                "day_of_week": "Friday",
                "predicted_demand": 85,
                "recommended_prep": 90,
                "confidence": 92.0,
                "expected_waste": 5,
                "shortage_risk": "Low",
                "weather_condition": "Sunny",
                "rain_probability": 10,
                "factors": ["Friday Dinner Surge (+42%)", "Sunny Weather (+11%)", "Recent Trend (+18%)"],
                "explanation": "Demand expected to increase by 12% tomorrow due to Friday evening peak."
            },
            {
                "id": "pred-2",
                "food_item_id": "item-002",
                "prediction_date": today + timedelta(days=1),
                "day_of_week": "Friday",
                "predicted_demand": 62,
                "recommended_prep": 65,
                "confidence": 91.0,
                "expected_waste": 3,
                "shortage_risk": "Low",
                "weather_condition": "Sunny",
                "rain_probability": 10,
                "factors": ["Consistent Weekly Trend", "Mild Weather"],
                "explanation": "Demand remains steady with low risk of over-preparation waste."
            }
        ]
        for p in predictions_data:
            db.add(DemandPrediction(**p))

    # 7. Seed Preparation Batches
    if db.query(PreparationBatch).count() == 0:
        batches_data = [
            {"id": "b-1", "food_item_id": "item-001", "batch_size": 60, "prepare_time": "11:30 AM", "status": "Completed", "station": "Station A", "date": today},
            {"id": "b-2", "food_item_id": "item-001", "batch_size": 30, "prepare_time": "06:30 PM", "status": "Scheduled", "station": "Station A", "date": today},
            {"id": "b-3", "food_item_id": "item-002", "batch_size": 40, "prepare_time": "11:45 AM", "status": "Completed", "station": "Station B", "date": today}
        ]
        for b in batches_data:
            db.add(PreparationBatch(**b))

    # 8. Seed Notifications / Realtime Alerts
    if db.query(Notification).count() == 0:
        alerts_data = [
            {
                "id": "alert-1",
                "type": "warning",
                "priority": "HIGH",
                "title": "Demand Spike Warning",
                "time_label": "2 mins ago",
                "reason": "Masala Dosa breakfast demand may increase by 18% due to morning footfall pattern.",
                "recommended_action": "Prepare Batch 1 (60 portions) 15 minutes earlier."
            },
            {
                "id": "alert-2",
                "type": "critical",
                "priority": "CRITICAL",
                "title": "Waste Risk Alert",
                "time_label": "10 mins ago",
                "reason": "Paneer Curry has shown unusually high over-prep waste this week (+14%).",
                "recommended_action": "Reduce evening preparation batch by 8 portions."
            },
            {
                "id": "alert-3",
                "type": "opportunity",
                "priority": "OPPORTUNITY",
                "title": "Smart Cost Opportunity",
                "time_label": "25 mins ago",
                "reason": "Reducing Fresh Salad prep batch by 8 portions saves approximately ₹420 today.",
                "recommended_action": "Enable 2-stage batch prep strategy."
            }
        ]
        for a in alerts_data:
            db.add(Notification(**a))

    db.commit()
