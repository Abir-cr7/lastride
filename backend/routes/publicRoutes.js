const express = require('express');
const router = express.Router();
const Fuel = require('../models/Fuel');
const ServiceCenter = require('../models/ServiceCenter');
const Alert = require('../models/Alert');

// @route   GET /api/fuels
// @desc    Get all available fuels and current prices
// @access  Public
router.get('/fuels', async (req, res, next) => {
  try {
    const fuels = await Fuel.find().sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: fuels.length,
      data: fuels,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/service-centers
// @desc    Get all service centers (Ashulia/Dhaka area)
// @access  Public
router.get('/service-centers', async (req, res, next) => {
  try {
    const centers = await ServiceCenter.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: centers.length,
      data: centers,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/alerts
// @desc    Get public active alerts
// @access  Public
router.get('/alerts', async (req, res, next) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
