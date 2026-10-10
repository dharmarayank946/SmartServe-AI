import io
import pytest
from tests.conftest import TestingSessionLocal, client



# --- FOOD ITEMS ENDPOINTS TESTS ---

def test_get_food_items():
    response = client.get("/api/v1/food-items")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 6
    assert data[0]["name"] is not None
    assert "avgDailySales" in data[0]


def test_get_food_items_filter_and_pagination():
    response = client.get("/api/v1/food-items?category=Main Course&skip=0&limit=2")
    assert response.status_code == 200
    data = response.json()
    assert len(data) <= 2
    assert all(item["category"] == "Main Course" for item in data)


def test_get_food_items_search():
    response = client.get("/api/v1/food-items?search=Biryani")
    assert response.status_code == 200
    data = response.json()
    assert all("Biryani" in item["name"] for item in data)


def test_create_food_item_success_and_persistence():
    new_item = {
        "name": "Butter Naan",
        "category": "Main Course",
        "price": 60.0,
        "cost": 15.0,
        "avgDailySales": 150,
        "currentStock": 200,
        "unit": "pieces",
        "tags": ["Fast Turnaround"]
    }
    response = client.post("/api/v1/food-items", json=new_item)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Butter Naan"
    assert data["id"].startswith("item-")
    assert data["avgDailySales"] == 150

    # Verify persistence
    get_resp = client.get(f"/api/v1/food-items?search=Butter%20Naan")
    assert get_resp.status_code == 200
    search_data = get_resp.json()
    assert any(i["id"] == data["id"] for i in search_data)


def test_create_food_item_invalid_input():
    invalid_item = {
        "name": "Invalid Item",
        "category": "Main Course",
        "price": -10.0,  # Invalid negative price
        "cost": 15.0
    }
    response = client.post("/api/v1/food-items", json=invalid_item)
    assert response.status_code == 422


def test_update_food_item_success_and_persistence():
    create_resp = client.post("/api/v1/food-items", json={
        "name": "Paneer Roll",
        "category": "Appetizers",
        "price": 120.0,
        "cost": 40.0
    })
    item_id = create_resp.json()["id"]

    update_payload = {"price": 140.0, "current_stock": 80}
    response = client.put(f"/api/v1/food-items/{item_id}", json=update_payload)
    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 140.0
    assert data["currentStock"] == 80


def test_update_food_item_not_found():
    response = client.put("/api/v1/food-items/non-existent-id", json={"price": 100.0})
    assert response.status_code == 404


def test_update_food_item_invalid_input():
    items_resp = client.get("/api/v1/food-items")
    item_id = items_resp.json()[0]["id"]
    response = client.put(f"/api/v1/food-items/{item_id}", json={"price": -50.0})
    assert response.status_code == 422


def test_delete_food_item_success_and_missing():
    create_resp = client.post("/api/v1/food-items", json={
        "name": "Temporary Snack",
        "category": "Appetizers",
        "price": 100.0,
        "cost": 30.0
    })
    item_id = create_resp.json()["id"]

    del_resp = client.delete(f"/api/v1/food-items/{item_id}")
    assert del_resp.status_code == 200
    assert del_resp.json()["success"] is True

    # Confirm it's gone (missing record)
    del_resp_again = client.delete(f"/api/v1/food-items/{item_id}")
    assert del_resp_again.status_code == 404


# --- SALES ENDPOINTS TESTS ---

def test_get_sales():
    response = client.get("/api/v1/sales")
    assert response.status_code == 200
    data = response.json()
    assert "todayPortions" in data
    assert "revenue" in data
    assert "trends" in data
    assert isinstance(data["trends"], list)


def test_get_sales_date_filter():
    response = client.get("/api/v1/sales?start_date=2026-10-01&end_date=2026-10-10")
    assert response.status_code == 200
    data = response.json()
    assert "records" in data


def test_add_sales_record_success_and_persistence():
    payload = {
        "date": "2026-10-08",
        "quantity_sold": 120,
        "revenue": 18000.0,
        "food_item_id": "item-001"
    }
    response = client.post("/api/v1/sales", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["record"]["quantity_sold"] == 120


def test_add_sales_record_invalid_input():
    payload = {
        "date": "2026-10-08",
        "quantity_sold": -5,  # Invalid negative quantity
        "revenue": 18000.0
    }
    response = client.post("/api/v1/sales", json=payload)
    assert response.status_code == 422


def test_upload_sales_csv_valid():
    csv_content = (
        "date,quantity_sold,revenue,food_item_id\n"
        "2026-10-07,150,22500.0,item-001\n"
        "2026-10-06,180,27000.0,item-002\n"
    )
    file_bytes = io.BytesIO(csv_content.encode("utf-8"))
    files = {"file": ("test_sales.csv", file_bytes, "text/csv")}
    response = client.post("/api/v1/sales/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["recordsProcessed"] == 2


def test_upload_sales_csv_with_corrupted_rows():
    csv_content = (
        "date,quantity_sold,revenue,food_item_id\n"
        "2026-10-07,150,22500.0,item-001\n"
        "INVALID-DATE,abc,-10.0,item-002\n"  # Invalid row
        "2026-10-05,100,15000.0,item-003\n"
    )
    file_bytes = io.BytesIO(csv_content.encode("utf-8"))
    files = {"file": ("test_sales.csv", file_bytes, "text/csv")}
    response = client.post("/api/v1/sales/upload", files=files)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["recordsProcessed"] == 2  # Only valid rows processed


def test_upload_sales_csv_invalid_file_type():
    file_bytes = io.BytesIO(b"dummy text")
    files = {"file": ("test.txt", file_bytes, "text/plain")}
    response = client.post("/api/v1/sales/upload", files=files)
    assert response.status_code == 400


def test_upload_sales_csv_missing_headers():
    csv_content = (
        "wrong_header1,wrong_header2\n"
        "2026-10-07,150\n"
    )
    file_bytes = io.BytesIO(csv_content.encode("utf-8"))
    files = {"file": ("test_sales.csv", file_bytes, "text/csv")}
    response = client.post("/api/v1/sales/upload", files=files)
    assert response.status_code == 400


def test_upload_sales_csv_empty_file():
    file_bytes = io.BytesIO(b"")
    files = {"file": ("empty.csv", file_bytes, "text/csv")}
    response = client.post("/api/v1/sales/upload", files=files)
    assert response.status_code == 400


# --- WASTE ENDPOINTS TESTS ---

def test_get_waste_metrics():
    response = client.get("/api/v1/waste")
    assert response.status_code == 200
    data = response.json()
    assert "todayWasteKg" in data
    assert "financialLoss" in data
    assert "wasteByReason" in data
    assert "mostWastedItems" in data


def test_get_waste_metrics_filtered():
    response = client.get("/api/v1/waste?reason=Over-preparation")
    assert response.status_code == 200
    data = response.json()
    assert "wasteLogs" in data


def test_log_waste_entry_success_and_persistence():
    payload = {
        "item_name": "Veg Biryani",
        "date": "2026-10-08",
        "time": "15:00",
        "quantity": 5,
        "unit": "portions",
        "reason": "Over-preparation",
        "financial_loss": 425.0,
        "notes": "Excess evening batch prep"
    }
    response = client.post("/api/v1/waste", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert data["wasteData"]["itemName"] == "Veg Biryani"
    assert data["wasteData"]["qty"] == 5


def test_log_waste_entry_invalid_input():
    payload = {
        "item_name": "",  # Invalid empty name
        "date": "2026-10-08",
        "quantity": -5.0,  # Invalid negative quantity
        "reason": "Over-preparation",
        "financial_loss": 100.0
    }
    response = client.post("/api/v1/waste", json=payload)
    assert response.status_code == 422


# --- DASHBOARD ENDPOINT TESTS ---

def test_get_dashboard_summary():
    response = client.get("/api/v1/dashboard")
    assert response.status_code == 200
    data = response.json()
    assert "todaySales" in data
    assert "predictedSales" in data
    assert "portionsPrepared" in data
    assert "expectedWaste" in data
    assert "digitalTwinNodes" in data
    assert len(data["digitalTwinNodes"]) == 6
