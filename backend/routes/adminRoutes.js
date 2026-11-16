const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Fuel = require('../models/Fuel');
const Request = require('../models/Request');
const ServiceCenter = require('../models/ServiceCenter');
const Alert = require('../models/Alert');
const { authenticate, isAdmin } = require('../middleware/auth');

// Protect all admin routes with authentication and admin role check
router.use(authenticate, isAdmin);

// ==========================================
// 1. DASHBOARD STATS
// ==========================================

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics for admin panel
// @access  Admin
router.get('/stats', async (req, res, next) => {
  try {
    const [
      totalUsers,
      restrictedUsers,
      totalRequests,
      pendingRequests,
      acceptedRequests,
      completedRequests,
      emergencyRequests,
      fuelOrders,
      totalFuels,
      totalServiceCenters,
      totalAlerts,
      recentRequests,
    ] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      User.countDocuments({ role: 'user', isRestricted: true }),
      Request.countDocuments(),
      Request.countDocuments({ status: 'pending' }),
      Request.countDocuments({ status: 'accepted' }),
      Request.countDocuments({ status: 'completed' }),
      Request.countDocuments({ type: 'emergency_rescue' }),
      Request.countDocuments({ type: 'fuel_order' }),
      Fuel.countDocuments(),
      ServiceCenter.countDocuments(),
      Alert.countDocuments(),
      Request.find().sort({ createdAt: -1 }).limit(5),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          restricted: restrictedUsers,
          active: totalUsers - restrictedUsers,
        },
        requests: {
          total: totalRequests,
          pending: pendingRequests,
          accepted: acceptedRequests,
          completed: completedRequests,
          emergencyRescue: emergencyRequests,
          fuelOrders: fuelOrders,
        },
        infrastructure: {
          fuels: totalFuels,
          serviceCenters: totalServiceCenters,
          alerts: totalAlerts,
        },
        recentRequests,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 2. FUEL MANAGEMENT (Add / Update)
// ==========================================

// @route   GET /api/admin/fuels
// @desc    List all fuels
// @access  Admin
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

// @route   POST /api/admin/fuels
// @desc    Add a new fuel
// @access  Admin
router.post('/fuels', async (req, res, next) => {
  try {
    const { name, pricePerLiter, unit } = req.body;

    if (!name || pricePerLiter === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Fuel name and pricePerLiter are required.',
      });
    }

    if (!['Petrol', 'Diesel', 'Octane'].includes(name)) {
      return res.status(400).json({
        success: false,
        message: "Fuel name must be 'Petrol', 'Diesel', or 'Octane'.",
      });
    }

    const existing = await Fuel.findOne({ name });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `Fuel '${name}' already exists. Please update its price instead.`,
      });
    }

    const fuel = await Fuel.create({
      name,
      pricePerLiter: Number(pricePerLiter),
      unit: unit || 'Liter',
      updatedAt: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Fuel added successfully.',
      data: fuel,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/fuels/:id
// @desc    Update fuel price and details
// @access  Admin
router.put('/fuels/:id', async (req, res, next) => {
  try {
    const { pricePerLiter, unit, name } = req.body;
    const fuel = await Fuel.findById(req.params.id);

    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Fuel item not found.',
      });
    }

    if (pricePerLiter !== undefined) {
      fuel.pricePerLiter = Number(pricePerLiter);
    }
    if (unit !== undefined) {
      fuel.unit = unit;
    }
    if (name && ['Petrol', 'Diesel', 'Octane'].includes(name)) {
      fuel.name = name;
    }
    fuel.updatedAt = new Date();

    await fuel.save();

    return res.status(200).json({
      success: true,
      message: 'Fuel updated successfully.',
      data: fuel,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/admin/fuels/:id
// @desc    Delete a fuel item
// @access  Admin
router.delete('/fuels/:id', async (req, res, next) => {
  try {
    const fuel = await Fuel.findByIdAndDelete(req.params.id);
    if (!fuel) {
      return res.status(404).json({
        success: false,
        message: 'Fuel not found.',
      });
    }
    return res.status(200).json({
      success: true,
      message: 'Fuel deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 3. REQUEST MANAGEMENT (Accept / Update)
// ==========================================

// @route   GET /api/admin/requests
// @desc    Get all requests (filter by status or type)
// @access  Admin
router.get('/requests', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const requests = await Request.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/requests/:id/accept
// @desc    Accept a pending request
// @access  Admin
router.put('/requests/:id/accept', async (req, res, next) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    request.status = 'accepted';
    await request.save();

    return res.status(200).json({
      success: true,
      message: 'Request has been accepted.',
      data: request,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/requests/:id/status
// @desc    Update status of request ('pending', 'accepted', 'completed')
// @access  Admin
router.put('/requests/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'accepted', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'pending', 'accepted', or 'completed'.",
      });
    }

    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Request not found.',
      });
    }

    request.status = status;
    await request.save();

    return res.status(200).json({
      success: true,
      message: `Request status updated to '${status}'.`,
      data: request,
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 4. USER MANAGEMENT (List & Restrict)
// ==========================================

// @route   GET /api/admin/users
// @desc    List all registered users
// @access  Admin
router.get('/users', async (req, res, next) => {
  try {
    const users = await User.find().select('-password -otp -otpExpires').sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/users/:id/restrict
// @desc    Toggle restrict/unrestrict user status
// @access  Admin
router.put('/users/:id/restrict', async (req, res, next) => {
  try {
    const targetUser = await User.findById(req.params.id);

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Prevent admin from restricting their own account
    if (targetUser._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Administrators cannot restrict their own account.',
      });
    }

    // If explicit isRestricted boolean provided in body, use it; otherwise toggle
    if (typeof req.body.isRestricted === 'boolean') {
      targetUser.isRestricted = req.body.isRestricted;
    } else {
      targetUser.isRestricted = !targetUser.isRestricted;
    }

    await targetUser.save();

    return res.status(200).json({
      success: true,
      message: `User ${targetUser.email} is now ${targetUser.isRestricted ? 'restricted' : 'unrestricted'}.`,
      data: {
        id: targetUser._id,
        name: targetUser.name,
        email: targetUser.email,
        role: targetUser.role,
        isRestricted: targetUser.isRestricted,
        isVerified: targetUser.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 5. SERVICE CENTER MANAGEMENT (Add / List / Update / Delete)
// ==========================================

// @route   GET /api/admin/service-centers
// @desc    List all service centers
// @access  Admin
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

// @route   POST /api/admin/service-centers
// @desc    Add a service center
// @access  Admin
router.post('/service-centers', async (req, res, next) => {
  try {
    const { name, contactNumber, address, lat, lng } = req.body;

    if (!name || !contactNumber || !address || lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'name, contactNumber, address, lat, and lng are all required.',
      });
    }

    const newCenter = await ServiceCenter.create({
      name: name.trim(),
      contactNumber: contactNumber.trim(),
      address: address.trim(),
      lat: Number(lat),
      lng: Number(lng),
    });

    return res.status(201).json({
      success: true,
      message: 'Service center added successfully.',
      data: newCenter,
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/service-centers/:id
// @desc    Update a service center
// @access  Admin
router.put('/service-centers/:id', async (req, res, next) => {
  try {
    const { name, contactNumber, address, lat, lng } = req.body;
    const center = await ServiceCenter.findById(req.params.id);

    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Service center not found.',
      });
    }

    if (name) center.name = name.trim();
    if (contactNumber) center.contactNumber = contactNumber.trim();
    if (address) center.address = address.trim();
    if (lat !== undefined) center.lat = Number(lat);
    if (lng !== undefined) center.lng = Number(lng);

    await center.save();

    return res.status(200).json({
      success: true,
      message: 'Service center updated successfully.',
      data: center,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/admin/service-centers/:id
// @desc    Delete a service center
// @access  Admin
router.delete('/service-centers/:id', async (req, res, next) => {
  try {
    const center = await ServiceCenter.findByIdAndDelete(req.params.id);
    if (!center) {
      return res.status(404).json({
        success: false,
        message: 'Service center not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Service center deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

// ==========================================
// 6. ALERTS MANAGEMENT (Create / List / Delete)
// ==========================================

// @route   GET /api/admin/alerts
// @desc    List all alerts
// @access  Admin
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

// @route   POST /api/admin/alerts
// @desc    Create a new alert
// @access  Admin
router.post('/alerts', async (req, res, next) => {
  try {
    const { title, message, severity } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'Alert title and message are required.',
      });
    }

    if (severity && !['warning', 'critical'].includes(severity)) {
      return res.status(400).json({
        success: false,
        message: "Severity must be either 'warning' or 'critical'.",
      });
    }

    const newAlert = await Alert.create({
      title: title.trim(),
      message: message.trim(),
      severity: severity || 'warning',
    });

    return res.status(201).json({
      success: true,
      message: 'Alert created successfully.',
      data: newAlert,
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/admin/alerts/:id
// @desc    Delete an alert
// @access  Admin
router.delete('/alerts/:id', async (req, res, next) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.id);
    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Alert not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Alert deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
