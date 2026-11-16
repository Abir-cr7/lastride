const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

// @route   POST /api/requests
// @desc    Create a fuel_order or emergency_rescue request
// @access  Private (Rider/User)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const { type, fuelType, quantity, lat, lng, userName, userPhone } = req.body;

    if (!type || !['fuel_order', 'emergency_rescue'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid request type. Must be either 'fuel_order' or 'emergency_rescue'.",
      });
    }

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Latitude (lat) and Longitude (lng) are required.',
      });
    }

    if (type === 'fuel_order') {
      if (!fuelType || !['Petrol', 'Diesel', 'Octane'].includes(fuelType)) {
        return res.status(400).json({
          success: false,
          message: "Valid fuelType ('Petrol', 'Diesel', or 'Octane') is required for fuel orders.",
        });
      }
      if (!quantity || quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a positive number of liters.',
        });
      }
    }

    const newRequest = await Request.create({
      userId: req.user._id,
      userName: userName || req.user.name,
      userPhone: userPhone || req.user.phone,
      type,
      fuelType: type === 'fuel_order' ? fuelType : null,
      quantity: type === 'fuel_order' ? Number(quantity) : null,
      lat: Number(lat),
      lng: Number(lng),
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: `${type === 'emergency_rescue' ? 'Emergency Rescue SOS' : 'Fuel Order'} created successfully.`,
      data: newRequest,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/requests/my-requests
// @desc    Get all requests made by the authenticated user
// @access  Private
router.get('/my-requests', authenticate, async (req, res, next) => {
  try {
    const requests = await Request.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/requests/user/:userId
// @desc    Get requests by user ID
// @access  Private
router.get('/user/:userId', authenticate, async (req, res, next) => {
  try {
    // Only allow user to view their own requests unless admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view requests of other users.',
      });
    }

    const requests = await Request.find({ userId: req.params.userId }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/requests/:id
// @desc    Get single request details
// @access  Private
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    if (req.user.role !== 'admin' && request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this request.',
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/requests/:id/review (also support POST /api/requests/:id/review)
// @desc    Rate and review an accepted or completed request
// @access  Private
const handleReview = async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    // Must be the owner or admin
    if (req.user.role !== 'admin' && request.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You can only review your own requests.',
      });
    }

    // Must be accepted or completed
    if (request.status === 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot review a pending request. The request must be accepted or completed first.',
      });
    }

    if (rating === undefined || rating === null) {
      return res.status(400).json({
        success: false,
        message: 'Rating is required (1-5).',
      });
    }

    const numRating = Number(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be an integer between 1 and 5.',
      });
    }

    request.rating = numRating;
    if (review !== undefined) {
      request.review = review.trim();
    }
    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Rating and review submitted successfully.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
};

router.put('/:id/review', authenticate, handleReview);
router.post('/:id/review', authenticate, handleReview);

module.exports = router;
