const mongoose = require('mongoose');

const communityStatsSchema = new mongoose.Schema(
  {
    area: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
      index: true,
    },
    state: {
      type: String,
      required: true,
      index: true,
    },
    pincode: {
      type: String,
      index: true,
    },
    // Statistics
    totalUsers: {
      type: Number,
      default: 0,
    },
    activeUsers: {
      type: Number,
      default: 0,
    },
    totalAssessments: {
      type: Number,
      default: 0,
    },
    totalLitresSaved: {
      type: Number,
      default: 0,
    },
    totalLitresRecharged: {
      type: Number,
      default: 0,
    },
    // Monthly Data
    monthlyData: [
      {
        month: { type: String },
        year: { type: Number },
        rainfall: { type: Number },
        waterSaved: { type: Number },
        newUsers: { type: Number },
      },
    ],
    // Average Metrics
    averageRoofArea: {
      type: Number,
      default: 0,
    },
    averageFeasibilityScore: {
      type: Number,
      default: 0,
    },
    // Goals & Achievements
    goals: {
      targetUsers: { type: Number, default: 100 },
      targetWaterSaved: { type: Number, default: 1000000 },
    },
    achievements: [
      {
        title: String,
        description: String,
        date: Date,
      },
    ],
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geographical queries
communityStatsSchema.index({ city: 1, state: 1 });

module.exports = mongoose.model('CommunityStats', communityStatsSchema);
