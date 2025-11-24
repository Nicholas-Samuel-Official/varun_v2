const mongoose = require('mongoose');
const { APPOINTMENT_STATUS } = require('../config/constants');

const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    expertId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      default: null,
    },
    // Appointment Details
    preferredDate: {
      type: Date,
      required: [true, 'Preferred date is required'],
    },
    preferredTime: {
      type: String,
      required: [true, 'Preferred time is required'],
    },
    actualDate: {
      type: Date,
      default: null,
    },
    location: {
      address: { type: String, required: true },
      city: { type: String },
      state: { type: String },
      pincode: { type: String },
      coordinates: {
        latitude: { type: Number },
        longitude: { type: Number },
      },
    },
    // Contact Information
    contactName: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    // Appointment Status
    status: {
      type: String,
      enum: Object.values(APPOINTMENT_STATUS),
      default: APPOINTMENT_STATUS.PENDING,
    },
    // Additional Details
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
    },
    expertNotes: {
      type: String,
      maxlength: [1000, 'Expert notes cannot exceed 1000 characters'],
    },
    serviceType: {
      type: String,
      enum: ['assessment', 'installation', 'maintenance', 'consultation'],
      default: 'assessment',
    },
    // Completion Data
    completedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      maxlength: [500, 'Feedback cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
appointmentSchema.index({ userId: 1, status: 1 });
appointmentSchema.index({ expertId: 1, status: 1 });
appointmentSchema.index({ preferredDate: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
