const mongoose = require('mongoose');

const sensorReadingSchema = new mongoose.Schema(
  {
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IoTSensor',
      required: true,
      index: true,
    },
    value: {
      type: Number,
      required: true,
    },
    unit: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    quality: {
      type: String,
      enum: ['good', 'fair', 'poor'],
      default: 'good',
    },
    isAnomaly: {
      type: Boolean,
      default: false,
    },
    metadata: {
      temperature: { type: Number },
      humidity: { type: Number },
      pressure: { type: Number },
    },
  },
  {
    timestamps: false,
  }
);

// Index for time-series queries
sensorReadingSchema.index({ sensorId: 1, timestamp: -1 });
sensorReadingSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // Auto-delete after 90 days

module.exports = mongoose.model('SensorReading', sensorReadingSchema);
