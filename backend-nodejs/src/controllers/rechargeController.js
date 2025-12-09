const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');

// Aquifer mapping to permeability
const aquiferPermeability = {
  // High permeability
  'alluvium': 'high',
  'sand': 'high',
  'gravel': 'high',
  'sandy': 'high',
  // Medium permeability
  'hard rock': 'medium',
  'limestone': 'medium',
  'granite': 'medium',
  'basalt': 'medium',
  // Low permeability
  'clay': 'low',
  'shale': 'low',
  'clayey': 'low',
};

// Aquifer numeric codes to types (based on common geological classifications)
const aquiferCodeToType = {
  6: 'alluvium',
  7: 'sand',
  8: 'sand',
  10: 'hard rock',
  11: 'hard rock',
  12: 'granite',
  15: 'alluvium',
  17: 'limestone',
  18: 'limestone',
  19: 'sand',
  20: 'hard rock',
  33: 'alluvium',
};

// Calculate distance using Haversine formula
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Determine depth class
const getDepthClass = (depth) => {
  if (depth < 3) return 'D1';
  if (depth >= 3 && depth < 10) return 'D2';
  if (depth >= 10 && depth < 20) return 'D3';
  if (depth >= 20 && depth < 40) return 'D4';
  return 'D5';
};

// Determine recharge potential
const getRechargePotential = (depthClass, permeability) => {
  const matrix = {
    'D1': { 'low': 'Very Low', 'medium': 'Very Low', 'high': 'Very Low' },
    'D2': { 'low': 'Very Low', 'medium': 'Low', 'high': 'Medium' },
    'D3': { 'low': 'Low', 'medium': 'Medium', 'high': 'High' },
    'D4': { 'low': 'Medium', 'medium': 'High', 'high': 'Very High' },
    'D5': { 'low': 'Medium', 'medium': 'High', 'high': 'Very High' },
  };
  return matrix[depthClass][permeability];
};

// Generate explanation
const generateExplanation = (groundwaterLevel, aquifer, permeability, rechargePotential) => {
  const depthClass = getDepthClass(groundwaterLevel);
  const depthDesc = {
    'D1': 'very shallow',
    'D2': 'shallow',
    'D3': 'moderate',
    'D4': 'deep',
    'D5': 'very deep'
  };

  const shortReason = `Groundwater at ${groundwaterLevel}m depth (${depthDesc[depthClass]}) with ${permeability} permeability ${aquifer} aquifer.`;
  
  const details = `The site has ${depthDesc[depthClass]} groundwater (${depthClass}: ${groundwaterLevel}m bgl) in ${aquifer} aquifer with ${permeability} soil permeability. ` +
    `This combination yields ${rechargePotential.toLowerCase()} artificial recharge potential. ` +
    `${rechargePotential === 'Very High' || rechargePotential === 'High' ? 'Excellent conditions for rainwater recharge structures.' : 
      rechargePotential === 'Medium' ? 'Moderate conditions suitable for recharge with proper design.' :
      'Limited recharge potential, consider alternative water conservation methods.'}`;

  return { shortReason, details };
};

// Main controller function
const calculateRechargePotential = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const userLat = parseFloat(latitude);
    const userLon = parseFloat(longitude);

    // Load dataset
    const datasetPath = path.join(__dirname, '../../assets/groundwater_dataset.csv');
    
    if (!fs.existsSync(datasetPath)) {
      return res.status(500).json({
        success: false,
        message: 'Groundwater dataset not found',
      });
    }

    const csvData = fs.readFileSync(datasetPath, 'utf8');
    const lines = csvData.split('\n').slice(1); // Skip header

    let nearestLocation = null;
    let minDistance = Infinity;

    // Find nearest location
    for (const line of lines) {
      if (!line.trim()) continue;
      const parts = line.split(',');
      if (parts.length < 4) continue;

      const lat = parseFloat(parts[0]);
      const lon = parseFloat(parts[1]);
      const groundwaterLevel = parseFloat(parts[2]);
      const aquiferCode = parseFloat(parts[3]);

      if (isNaN(lat) || isNaN(lon) || isNaN(groundwaterLevel)) continue;

      const distance = calculateDistance(userLat, userLon, lat, lon);

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = {
          latitude: lat,
          longitude: lon,
          groundwater_level_m_bgl: groundwaterLevel,
          aquifer_code: aquiferCode,
        };
      }
    }

    if (!nearestLocation) {
      return res.status(404).json({
        success: false,
        message: 'No nearby groundwater data found',
      });
    }

    // Determine aquifer type and permeability
    const aquiferType = aquiferCodeToType[nearestLocation.aquifer_code] || 'hard rock';
    const soilPermeability = aquiferPermeability[aquiferType] || 'medium';

    // Calculate recharge potential
    const depthClass = getDepthClass(nearestLocation.groundwater_level_m_bgl);
    const rechargePotential = getRechargePotential(depthClass, soilPermeability);

    // Generate explanation
    const { shortReason, details } = generateExplanation(
      nearestLocation.groundwater_level_m_bgl,
      aquiferType,
      soilPermeability,
      rechargePotential
    );

    const result = {
      latitude: nearestLocation.latitude,
      longitude: nearestLocation.longitude,
      groundwater_level_m_bgl: nearestLocation.groundwater_level_m_bgl,
      aquifer: aquiferType,
      soil_permeability_class: soilPermeability,
      recharge_potential: rechargePotential,
      short_reason: shortReason,
      details: details,
      distance_km: parseFloat(minDistance.toFixed(2)),
    };

    logger.info(`Recharge potential calculated for ${userLat}, ${userLon}: ${rechargePotential}`);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    logger.error(`Recharge calculation error: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate recharge potential',
      error: error.message,
    });
  }
};

module.exports = {
  calculateRechargePotential,
};
