import httpx
from typing import Dict, Any, Optional
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class WeatherService:
    """Service to fetch weather data from Open-Meteo API (free, no key required)"""
    
    def __init__(self):
        self.base_url = "https://api.open-meteo.com/v1/forecast"
        self.aqi_url = "https://api.openaq.org/v2/latest"
    
    async def get_weather_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch current weather and rainfall data"""
        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
                "hourly": "precipitation",
                "timezone": "auto",
                "forecast_days": 1
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                current = data.get('current', {})
                hourly = data.get('hourly', {})
                
                # Calculate today's total rainfall
                precipitation_values = hourly.get('precipitation', [])
                rainfall_today = sum(p for p in precipitation_values if p is not None)
                
                # Weather code to description mapping
                weather_descriptions = {
                    0: 'Clear Sky',
                    1: 'Mainly Clear',
                    2: 'Partly Cloudy',
                    3: 'Overcast',
                    45: 'Foggy',
                    48: 'Foggy',
                    51: 'Light Drizzle',
                    53: 'Drizzle',
                    55: 'Heavy Drizzle',
                    61: 'Light Rain',
                    63: 'Rain',
                    65: 'Heavy Rain',
                    71: 'Light Snow',
                    73: 'Snow',
                    75: 'Heavy Snow',
                    80: 'Light Showers',
                    81: 'Showers',
                    82: 'Heavy Showers',
                    95: 'Thunderstorm',
                    96: 'Thunderstorm with Hail',
                    99: 'Thunderstorm with Hail'
                }
                
                weather_code = current.get('weather_code', 0)
                weather_description = weather_descriptions.get(weather_code, 'Unknown')
                
                return {
                    'temperature': round(current.get('temperature_2m', 0), 1),
                    'humidity': current.get('relative_humidity_2m', 0),
                    'precipitation_current': current.get('precipitation', 0),
                    'rainfall_today': round(rainfall_today, 2),
                    'weather_description': weather_description,
                    'weather_code': weather_code,
                    'timestamp': datetime.utcnow().isoformat()
                }
                
        except httpx.HTTPError as e:
            logger.error(f"Weather API HTTP error: {str(e)}")
            return self._get_fallback_weather()
        except Exception as e:
            logger.error(f"Weather API error: {str(e)}")
            return self._get_fallback_weather()
    
    async def get_aqi_data(self, latitude: float, longitude: float) -> Dict[str, Any]:
        """Fetch Air Quality Index data from OpenAQ"""
        try:
            params = {
                "coordinates": f"{latitude},{longitude}",
                "radius": "25000",  # 25km radius
                "limit": 1,
                "order_by": "distance"
            }
            
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(self.aqi_url, params=params)
                response.raise_for_status()
                data = response.json()
                
                results = data.get('results', [])
                if results:
                    measurements = results[0].get('measurements', [])
                    pm25_data = next((m for m in measurements if m.get('parameter') == 'pm25'), None)
                    
                    if pm25_data:
                        pm25_value = pm25_data.get('value', 0)
                        aqi = self._calculate_aqi_from_pm25(pm25_value)
                        aqi_category = self._get_aqi_category(aqi)
                        
                        return {
                            'aqi': aqi,
                            'aqi_category': aqi_category,
                            'pm25': round(pm25_value, 2),
                            'location': results[0].get('location', 'Unknown'),
                            'timestamp': datetime.utcnow().isoformat()
                        }
                
                # Fallback if no data found
                return self._get_fallback_aqi()
                
        except httpx.HTTPError as e:
            logger.error(f"AQI API HTTP error: {str(e)}")
            return self._get_fallback_aqi()
        except Exception as e:
            logger.error(f"AQI API error: {str(e)}")
            return self._get_fallback_aqi()
    
    def _calculate_aqi_from_pm25(self, pm25: float) -> int:
        """Calculate AQI from PM2.5 value using US EPA standard"""
        if pm25 <= 12.0:
            return int((50 / 12.0) * pm25)
        elif pm25 <= 35.4:
            return int(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1))
        elif pm25 <= 55.4:
            return int(100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5))
        elif pm25 <= 150.4:
            return int(150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5))
        elif pm25 <= 250.4:
            return int(200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5))
        else:
            return int(300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5))
    
    def _get_aqi_category(self, aqi: int) -> str:
        """Get AQI category from value"""
        if aqi <= 50:
            return 'Good'
        elif aqi <= 100:
            return 'Moderate'
        elif aqi <= 150:
            return 'Unhealthy for Sensitive Groups'
        elif aqi <= 200:
            return 'Unhealthy'
        elif aqi <= 300:
            return 'Very Unhealthy'
        else:
            return 'Hazardous'
    
    def _get_fallback_weather(self) -> Dict[str, Any]:
        """Return fallback weather data"""
        return {
            'temperature': 28,
            'humidity': 65,
            'precipitation_current': 0,
            'rainfall_today': 0,
            'weather_description': 'Data Unavailable',
            'weather_code': 0,
            'timestamp': datetime.utcnow().isoformat(),
            'error': 'Unable to fetch weather data'
        }
    
    def _get_fallback_aqi(self) -> Dict[str, Any]:
        """Return fallback AQI data"""
        return {
            'aqi': 65,
            'aqi_category': 'Moderate',
            'pm25': 25,
            'location': 'Estimated',
            'timestamp': datetime.utcnow().isoformat(),
            'error': 'Unable to fetch AQI data'
        }
