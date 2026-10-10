import pytest
from datetime import date
from unittest.mock import patch, MagicMock
import httpx

from app.services.weather_service import WeatherService, _WEATHER_CACHE
from app.services.holiday_service import HolidayService, _HOLIDAY_CACHE


@pytest.fixture(autouse=True)
def clear_caches():
    _WEATHER_CACHE.clear()
    _HOLIDAY_CACHE.clear()
    yield
    _WEATHER_CACHE.clear()
    _HOLIDAY_CACHE.clear()


# ==========================================
# Weather Service Unit Tests
# ==========================================

def test_weather_service_missing_api_key():
    service = WeatherService(api_key="")
    res = service.get_current_weather(city="Bengaluru")
    assert res["is_available"] is False
    assert res["city"] == "Bengaluru"
    assert "Missing OpenWeatherMap API key" in res["error_reason"]


def test_weather_service_success():
    service = WeatherService(api_key="mock_test_key")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "name": "Bengaluru",
        "weather": [{"main": "Rain", "description": "heavy intensity rain"}],
        "main": {"temp": 22.5, "humidity": 85},
        "rain": {"1h": 3.5},
    }

    with patch("httpx.Client.get", return_value=mock_response):
        res = service.get_current_weather(city="Bengaluru")
        assert res["is_available"] is True
        assert res["city"] == "Bengaluru"
        assert res["weather_condition"] == "Rain"
        assert res["temperature"] == 22.5
        assert res["rain_probability"] == 70
        assert res["humidity"] == 85


def test_weather_service_invalid_api_key_401():
    service = WeatherService(api_key="invalid_key")
    mock_response = MagicMock()
    mock_response.status_code = 401

    with patch("httpx.Client.get", return_value=mock_response):
        res = service.get_current_weather(city="Bengaluru")
        assert res["is_available"] is False
        assert "401" in res["error_reason"]
        assert res["weather_condition"] == "Unavailable"


def test_weather_service_rate_limit_429():
    service = WeatherService(api_key="mock_key")
    mock_response = MagicMock()
    mock_response.status_code = 429

    with patch("httpx.Client.get", return_value=mock_response):
        res = service.get_current_weather(city="Bengaluru")
        assert res["is_available"] is False
        assert "429" in res["error_reason"]


def test_weather_service_timeout():
    service = WeatherService(api_key="mock_key")

    with patch("httpx.Client.get", side_effect=httpx.TimeoutException("Connection timed out")):
        res = service.get_current_weather(city="Bengaluru")
        assert res["is_available"] is False
        assert "timed out" in res["error_reason"].lower()


def test_weather_service_caching():
    service = WeatherService(api_key="mock_key")
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = {
        "name": "Bengaluru",
        "weather": [{"main": "Clear", "description": "clear sky"}],
        "main": {"temp": 28.0, "humidity": 40},
    }

    with patch("httpx.Client.get", return_value=mock_response) as mock_get:
        res1 = service.get_current_weather(city="Bengaluru", lat=12.97, lon=77.59)
        res2 = service.get_current_weather(city="Bengaluru", lat=12.97, lon=77.59)
        assert res1 == res2
        assert mock_get.call_count == 1  # Second call served from cache


# ==========================================
# Holiday Service Unit Tests
# ==========================================

def test_holiday_service_success():
    service = HolidayService()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {
            "date": "2026-01-26",
            "localName": "Republic Day",
            "name": "Republic Day",
            "countryCode": "IN",
            "fixed": True,
            "global": True,
            "counties": None,
            "types": ["Public"],
        },
        {
            "date": "2026-08-15",
            "localName": "Independence Day",
            "name": "Independence Day",
            "countryCode": "IN",
            "fixed": True,
            "global": True,
            "counties": None,
            "types": ["Public"],
        },
        {
            "date": "2026-11-01",
            "localName": "Kannada Rajyotsava",
            "name": "Kannada Rajyotsava",
            "countryCode": "IN",
            "fixed": True,
            "global": False,
            "counties": ["IN-KA"],
            "types": ["Public"],
        },
    ]

    with patch("httpx.Client.get", return_value=mock_response):
        res = service.get_public_holidays(year=2026, country_code="IN")
        assert res["is_available"] is True
        assert res["count"] == 3
        assert res["country_code"] == "IN"

        # Test check_is_holiday
        check_republic = service.check_is_holiday(target_date=date(2026, 1, 26), country_code="IN")
        assert check_republic["is_holiday"] is True
        assert check_republic["holiday_name"] == "Republic Day"

        check_regular_day = service.check_is_holiday(target_date=date(2026, 2, 10), country_code="IN")
        assert check_regular_day["is_holiday"] is False


def test_holiday_service_regional_filtering():
    service = HolidayService()
    mock_response = MagicMock()
    mock_response.status_code = 200
    mock_response.json.return_value = [
        {
            "date": "2026-11-01",
            "localName": "Kannada Rajyotsava",
            "name": "Kannada Rajyotsava",
            "countryCode": "IN",
            "fixed": True,
            "global": False,
            "counties": ["IN-KA"],
            "types": ["Public"],
        },
    ]

    with patch("httpx.Client.get", return_value=mock_response):
        # Match Karnataka region
        check_ka = service.check_is_holiday(target_date=date(2026, 11, 1), country_code="IN", region_code="KA")
        assert check_ka["is_holiday"] is True
        assert check_ka["holiday_name"] == "Kannada Rajyotsava"

        # Non-matching region (e.g. MH - Maharashtra)
        check_mh = service.check_is_holiday(target_date=date(2026, 11, 1), country_code="IN", region_code="MH")
        assert check_mh["is_holiday"] is False


def test_holiday_service_failure():
    service = HolidayService()
    with patch("httpx.Client.get", side_effect=httpx.TimeoutException("Timeout")):
        res = service.get_public_holidays(year=2026, country_code="IN")
        assert res["is_available"] is False
        assert res["count"] == 0

        check_day = service.check_is_holiday(target_date=date(2026, 8, 15), country_code="IN")
        assert check_day["is_holiday"] is False
        assert check_day["is_available"] is False


# ==========================================
# FastAPI Endpoints Integration Tests
# ==========================================

def test_weather_api_endpoint():
    from tests.conftest import client
    mock_weather = {
        "city": "Bengaluru",
        "weather_condition": "Clouds",
        "temperature": 26.0,
        "rain_probability": 20,
        "humidity": 60,
        "description": "scattered clouds",
        "is_available": True,
        "error_reason": None,
    }
    with patch("app.services.weather_service.WeatherService.get_current_weather", return_value=mock_weather):
        response = client.get("/api/v1/weather?city=Bengaluru")
        assert response.status_code == 200
        data = response.json()
        assert data["city"] == "Bengaluru"
        assert data["weather_condition"] == "Clouds"
        assert data["temperature"] == 26.0
        assert data["rain_probability"] == 20


def test_holidays_api_endpoints():
    from tests.conftest import client
    mock_holidays = {
        "year": 2026,
        "country_code": "IN",
        "holidays": [
            {
                "date": "2026-01-26",
                "local_name": "Republic Day",
                "name": "Republic Day",
                "country_code": "IN",
                "fixed": True,
                "global": True,
                "types": ["Public"],
            }
        ],
        "count": 1,
        "is_available": True,
        "error_reason": None,
    }
    mock_check = {
        "date": "2026-01-26",
        "is_holiday": True,
        "holiday_name": "Republic Day",
        "is_available": True,
        "error_reason": None,
    }

    with patch("app.services.holiday_service.HolidayService.get_public_holidays", return_value=mock_holidays), \
         patch("app.services.holiday_service.HolidayService.check_is_holiday", return_value=mock_check):

        # Test GET /api/v1/holidays
        res1 = client.get("/api/v1/holidays?year=2026&country_code=IN")
        assert res1.status_code == 200
        data1 = res1.json()
        assert data1["count"] == 1
        assert data1["holidays"][0]["local_name"] == "Republic Day"

        # Test GET /api/v1/holidays/check
        res2 = client.get("/api/v1/holidays/check?date=2026-01-26&country_code=IN&region_code=KA")
        assert res2.status_code == 200
        data2 = res2.json()
        assert data2["is_holiday"] is True
        assert data2["holiday_name"] == "Republic Day"
