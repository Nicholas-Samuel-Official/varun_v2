const mongoose = require('mongoose');
const { SENSOR_TYPES } = require('../config/constants');

const iotSensorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sensorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    sensorType: {
      type: String,
      enum: Object.values(SENSOR_TYPES),
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      description: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    // Current Reading
    currentValue: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance', 'error'],
      default: 'active',
    },
    // Thresholds for Alerts
    thresholds: {
      min: { type: Number },
      max: { type: Number },
      optimal: { type: Number },
    },
    // Device Information
    deviceInfo: {
      manufacturer: { type: String },
      model: { type: String },
      firmwareVersion: { type: String },
      installationDate: { type: Date },
      lastMaintenanceDate: { type: Date },
    },
    // Calibration
    calibration: {
      lastCalibrated: { type: Date },
      calibrationFactor: { type: Number, default: 1.0 },
    },
    // Battery & Connectivity
    batteryLevel: {
      type: Number,
      min: 0,
      max: 100,
    },
    signalStrength: {
      type: Number,
      min: 0,
      max: 100,
    },
    isOnline: {
      type: Boolean,
      default: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
iotSensorSchema.index({ userId: 1, sensorType: 1 });
iotSensorSchema.index({ status: 1 });
iotSensorSchema.index({ lastSeen: -1 });

module.exports = mongoose.model('IoTSensor', iotSensorSchema);
