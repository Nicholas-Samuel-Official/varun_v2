const axios = require('axios');
const logger = require('../utils/logger');

class WeatherService {
  constructor() {
    this.openMeteoUrl = process.env.OPEN_METEO_URL;
    this.openAQUrl = process.env.OPENAQ_URL;
  }

  async getWeatherData(latitude, longitude) {
    try {
      const params = {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m',
        hourly: 'precipitation',
        timezone: 'auto',
        forecast_days: 1,
      };

      const response = await axios.get(this.openMeteoUrl, { params, timeout: 10000 });
      const data = response.data;

      const current = data.current || {};
      const hourly = data.hourly || {};

      // Calculate today's total rainfall
      const precipitationValues = hourly.precipitation || [];
      const rainfallToday = precipitationValues.reduce((sum, p) => sum + (p || 0), 0);

      // Weather code to description mapping
      const weatherDescriptions = {
        0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
        45: 'Foggy', 48: 'Foggy', 51: 'Light Drizzle', 53: 'Drizzle',
        55: 'Heavy Drizzle', 61: 'Light Rain', 63: 'Rain', 65: 'Heavy Rain',
        71: 'Light Snow', 73: 'Snow', 75: 'Heavy Snow', 80: 'Light Showers',
        81: 'Showers', 82: 'Heavy Showers', 95: 'Thunderstorm',
        96: 'Thunderstorm with Hail', 99: 'Thunderstorm with Hail',
      };

      const weatherCode = current.weather_code || 0;
      const weatherDescription = weatherDescriptions[weatherCode] || 'Unknown';

      return {
        temperature: Math.round((current.temperature_2m || 0) * 10) / 10,
        humidity: current.relative_humidity_2m || 0,
        precipitation_current: current.precipitation || 0,
        rainfall_today: Math.round(rainfallToday * 100) / 100,
        weather_description: weatherDescription,
        weather_code: weatherCode,
        wind_speed: Math.round((current.wind_speed_10m || 0) * 10) / 10,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      logger.error(`Weather API error: ${error.message}`);
      return this.getFallbackWeather();
    }
  }

  async getAQIData(latitude, longitude) {
    try {
      const params = {
        coordinates: `${latitude},${longitude}`,
        radius: '25000',
        limit: 1,
        order_by: 'distance',
      };

      const response = await axios.get(this.openAQUrl, { params, timeout: 10000 });
      const results = response.data.results || [];

      if (results.length > 0) {
        const measurements = results[0].measurements || [];
        const pm25Data = measurements.find((m) => m.parameter === 'pm25');

        if (pm25Data) {
          const pm25Value = pm25Data.value || 0;
          const aqi = this.calculateAQIFromPM25(pm25Value);
          const aqiCategory = this.getAQICategory(aqi);

          return {
            aqi,
            aqi_category: aqiCategory,
            pm25: Math.round(pm25Value * 100) / 100,
            location: results[0].location || 'Unknown',
            timestamp: new Date().toISOString(),
          };
        }
      }

      return this.getFallbackAQI();
    } catch (error) {
      logger.error(`AQI API error: ${error.message}`);
      return this.getFallbackAQI();
    }
  }

  calculateAQIFromPM25(pm25) {
    if (pm25 <= 12.0) return Math.floor((50 / 12.0) * pm25);
    if (pm25 <= 35.4) return Math.floor(50 + ((100 - 50) / (35.4 - 12.1)) * (pm25 - 12.1));
    if (pm25 <= 55.4) return Math.floor(100 + ((150 - 100) / (55.4 - 35.5)) * (pm25 - 35.5));
    if (pm25 <= 150.4) return Math.floor(150 + ((200 - 150) / (150.4 - 55.5)) * (pm25 - 55.5));
    if (pm25 <= 250.4) return Math.floor(200 + ((300 - 200) / (250.4 - 150.5)) * (pm25 - 150.5));
    return Math.floor(300 + ((500 - 300) / (500.4 - 250.5)) * (pm25 - 250.5));
  }

  getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
  }

  getFallbackWeather() {
    return {
      temperature: 28,
      humidity: 65,
      precipitation_current: 0,
      rainfall_today: 0,
      weather_description: 'Data Unavailable',
      weather_code: 0,
      wind_speed: 10,
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch weather data',
    };
  }

  getFallbackAQI() {
    return {
      aqi: 65,
      aqi_category: 'Moderate',
      pm25: 25,
      location: 'Estimated',
      timestamp: new Date().toISOString(),
      error: 'Unable to fetch AQI data',
    };
  }
}

module.exports = new WeatherService();
