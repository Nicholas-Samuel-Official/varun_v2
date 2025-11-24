const weatherService = require('../services/weatherService');
const logger = require('../utils/logger');

// @desc    Get current weather
// @route   GET /api/weather/current
// @access  Public
const getCurrentWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const weatherData = await weatherService.getWeatherData(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.status(200).json({
      success: true,
      data: weatherData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get AQI data
// @route   GET /api/weather/aqi
// @access  Public
const getAQI = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const aqiData = await weatherService.getAQIData(
      parseFloat(latitude),
      parseFloat(longitude)
    );

    res.status(200).json({
      success: true,
      data: aqiData,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get combined weather data
// @route   GET /api/weather/combined
// @access  Public
const getCombinedWeather = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const lat = parseFloat(latitude);
    const lon = parseFloat(longitude);

    const [weatherData, aqiData] = await Promise.all([
      weatherService.getWeatherData(lat, lon),
      weatherService.getAQIData(lat, lon),
    ]);

    res.status(200).json({
      success: true,
      data: {
        weather: weatherData,
        aqi: aqiData,
        location: {
          latitude: lat,
          longitude: lon,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getAQI,
  getCombinedWeather,
};
