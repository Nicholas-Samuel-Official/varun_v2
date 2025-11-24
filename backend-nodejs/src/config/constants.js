module.exports = {
  ROLES: {
    USER: 'user',
    EXPERT: 'expert',
    ADMIN: 'admin',
  },
  
  APPOINTMENT_STATUS: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  
  NOTIFICATION_TYPES: {
    APPOINTMENT: 'appointment',
    RAINFALL: 'rainfall',
    SYSTEM: 'system',
    ALERT: 'alert',
  },
  
  SENSOR_TYPES: {
    RAIN_INTENSITY: 'rain_intensity',
    TANK_LEVEL: 'tank_level',
    INFILTRATION_RATE: 'infiltration_rate',
    WATER_QUALITY: 'water_quality',
    FLOW_RATE: 'flow_rate',
    SYSTEM_PRESSURE: 'system_pressure',
  },
  
  FEASIBILITY_STATUS: {
    HIGHLY_FEASIBLE: 'highly_feasible',
    FEASIBLE: 'feasible',
    MODERATELY_FEASIBLE: 'moderately_feasible',
    NOT_FEASIBLE: 'not_feasible',
  },
};
