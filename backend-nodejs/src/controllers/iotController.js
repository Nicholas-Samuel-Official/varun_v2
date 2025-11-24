const IoTSensor = require('../models/IoTSensor');
const SensorReading = require('../models/SensorReading');
const logger = require('../utils/logger');

// @desc    Get user sensors
// @route   GET /api/iot/sensors
// @access  Private
const getSensors = async (req, res, next) => {
  try {
    const sensors = await IoTSensor.find({ userId: req.user._id });

    res.status(200).json({
      success: true,
      count: sensors.length,
      data: sensors,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sensor by ID
// @route   GET /api/iot/sensors/:id
// @access  Private
const getSensor = async (req, res, next) => {
  try {
    const sensor = await IoTSensor.findById(req.params.id);

    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found',
      });
    }

    // Check ownership
    if (sensor.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this sensor',
      });
    }

    res.status(200).json({
      success: true,
      data: sensor,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add sensor reading
// @route   POST /api/iot/sensors/:id/readings
// @access  Public (for IoT devices)
const addSensorReading = async (req, res, next) => {
  try {
    const { value, unit, quality, metadata } = req.body;

    const sensor = await IoTSensor.findById(req.params.id);
    if (!sensor) {
      return res.status(404).json({
        success: false,
        message: 'Sensor not found',
      });
    }

    // Create reading
    const reading = await SensorReading.create({
      sensorId: sensor._id,
      value,
      unit,
      quality,
      metadata,
    });

    // Update sensor current value
    sensor.currentValue = value;
    sensor.lastSeen = new Date();
    await sensor.save();

    res.status(201).json({
      success: true,
      data: reading,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get sensor readings
// @route   GET /api/iot/sensors/:id/readings
// @access  Private
const getSensorReadings = async (req, res, next) => {
  try {
    const { limit = 100, startDate, endDate } = req.query;

    const query = { sensorId: req.params.id };
    
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const readings = await SensorReading.find(query)
      .sort({ timestamp: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: readings.length,
      data: readings,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSensors,
  getSensor,
  addSensorReading,
  getSensorReadings,
};
