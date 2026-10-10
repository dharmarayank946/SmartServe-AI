import time
import logging
from typing import Dict, Any, Optional
import httpx

from app.core.config import settings

logger = logging.getLogger(__name__)

# In-memory weather cache: key -> (timestamp, data_dict)
_WEATHER_CACHE: Dict[str, tuple[float, Dict[str, Any]]] = {}


class WeatherService:
    def __init__(self, api_key: Optional[str] = None, timeout: float = 5.0):
        self.api_key = api_key or settings.OPENWEATHERMAP_API_KEY
        self.timeout = timeout
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_current_weather(
        self,
        city: Optional[str] = None,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Fetch current weather metrics (condition, temperature, rain_probability, humidity).
        Handles timeouts, invalid API keys, rate limits, and network errors gracefully.
        Returns is_available=False on failure or missing API key without raising exception.
        """
        target_city = city or settings.RESTAURANT_CITY
        target_lat = lat if lat is not None else settings.RESTAURANT_LAT
        target_lon = lon if lon is not None else settings.RESTAURANT_LON

        cache_key = f"{target_city}_{target_lat}_{target_lon}"

        # Check cache
        if cache_key in _WEATHER_CACHE:
            cached_time, cached_data = _WEATHER_CACHE[cache_key]
            if time.time() - cached_time < settings.WEATHER_CACHE_TTL_SECONDS:
                return cached_data

        if not self.api_key:
            return {
                "city": target_city,
                "weather_condition": "Unknown",
                "temperature": 25.0,
                "rain_probability": 0,
                "humidity": 50,
                "description": "API key not configured",
                "is_available": False,
                "error_reason": "Missing OpenWeatherMap API key",
            }

        params = {
            "appid": self.api_key,
            "units": "metric",
        }
        if target_lat is not None and target_lon is not None:
            params["lat"] = str(target_lat)
            params["lon"] = str(target_lon)
        else:
            params["q"] = target_city

        try:
            with httpx.Client(timeout=self.timeout) as client:
                response = client.get(self.base_url, params=params)

            if response.status_code == 200:
                data = response.json()
                weather_main = data.get("weather", [{}])[0].get("main", "Clear")
                weather_desc = data.get("weather", [{}])[0].get("description", "")
                temp = data.get("main", {}).get("temp", 25.0)
                humidity = data.get("main", {}).get("humidity", 50)

                # OpenWeatherMap current weather doesn't directly return POP (probability of precipitation)
                # We derive rain_probability based on rain volume or main condition
                rain_prob = 0
                if "rain" in data:
                    rain_3h = data["rain"].get("1h", data["rain"].get("3h", 0))
                    rain_prob = min(100, int(rain_3h * 20)) if rain_3h > 0 else 70
                elif weather_main.lower() in ["rain", "drizzle", "thunderstorm"]:
                    rain_prob = 80
                elif weather_main.lower() in ["clouds"]:
                    rain_prob = 20

                result = {
                    "city": data.get("name", target_city),
                    "weather_condition": weather_main,
                    "temperature": round(float(temp), 1),
                    "rain_probability": rain_prob,
                    "humidity": humidity,
                    "description": weather_desc,
                    "is_available": True,
                    "error_reason": None,
                }
                _WEATHER_CACHE[cache_key] = (time.time(), result)
                return result

            elif response.status_code == 401:
                return self._unavailable_response(target_city, "Invalid or unauthorized API key (401)")
            elif response.status_code == 429:
                return self._unavailable_response(target_city, "OpenWeatherMap rate limit exceeded (429)")
            else:
                return self._unavailable_response(target_city, f"Provider error status {response.status_code}")

        except httpx.TimeoutException:
            logger.warning("OpenWeatherMap API request timed out")
            return self._unavailable_response(target_city, "Request timed out")
        except httpx.HTTPError as e:
            logger.warning(f"OpenWeatherMap HTTP error: {e}")
            return self._unavailable_response(target_city, f"HTTP error: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected weather service error: {e}")
            return self._unavailable_response(target_city, f"Unexpected error: {str(e)}")

    def _unavailable_response(self, city: str, reason: str) -> Dict[str, Any]:
        return {
            "city": city,
            "weather_condition": "Unavailable",
            "temperature": 25.0,
            "rain_probability": 0,
            "humidity": 50,
            "description": reason,
            "is_available": False,
            "error_reason": reason,
        }


weather_service = WeatherService()
