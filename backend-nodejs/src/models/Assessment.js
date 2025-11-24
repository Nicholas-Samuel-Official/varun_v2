const mongoose = require('mongoose');
const { FEASIBILITY_STATUS } = require('../config/constants');

const assessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // Input Data
    roofArea: {
      type: Number,
      required: [true, 'Roof area is required'],
      min: [10, 'Roof area must be at least 10 sq.m'],
    },
    annualRainfall: {
      type: Number,
      required: [true, 'Annual rainfall is required'],
      min: [0, 'Annual rainfall cannot be negative'],
    },
    soilType: {
      type: String,
      enum: ['sandy', 'loamy', 'clayey', 'rocky', 'mixed'],
      required: true,
    },
    roofType: {
      type: String,
      enum: ['concrete', 'tile', 'sheet', 'thatched'],
      default: 'concrete',
    },
    numberOfPeople: {
      type: Number,
      min: [1, 'Number of people must be at least 1'],
      default: 4,
    },
    location: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
      city: { type: String },
      state: { type: String },
    },
    // Calculated Results
    feasibilityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    feasibilityStatus: {
      type: String,
      enum: Object.values(FEASIBILITY_STATUS),
    },
    potentialHarvestVolume: {
      type: Number, // liters per year
      default: 0,
    },
    rechargePotential: {
      type: Number, // liters per year
      default: 0,
    },
    waterSaved: {
      type: Number, // liters per year
      default: 0,
    },
    estimatedCost: {
      installation: { type: Number, default: 0 },
      maintenance: { type: Number, default: 0 },
      total: { type: Number, default: 0 },
    },
    roi: {
      years: { type: Number, default: 0 },
      savingsPerYear: { type: Number, default: 0 },
    },
    // AI/ML Recommendations
    recommendations: [
      {
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ['high', 'medium', 'low'],
        },
      },
    ],
    systemDesign: {
      tankCapacity: { type: Number }, // liters
      filterType: { type: String },
      pipeSize: { type: String },
      components: [{ type: String }],
    },
    status: {
      type: String,
      enum: ['draft', 'completed', 'archived'],
      default: 'completed',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
assessmentSchema.index({ userId: 1, createdAt: -1 });
assessmentSchema.index({ feasibilityStatus: 1 });

module.exports = mongoose.model('Assessment', assessmentSchema);
