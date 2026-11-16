const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendOtpEmail = require('../utils/sendOtpEmail');
const { authenticate } = require('../middleware/auth');

/**
 * Generate a secure 6-digit numeric OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Generate JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );
};

// @route   POST /api/auth/register
// @desc    Register a new user, generate 6-digit OTP (5 mins validity), dispatch email & console log
// @access  Public
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists and is verified. Please log in.',
        });
      }

      // Existing unverified user: update information and reissue OTP
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

      existingUser.name = name.trim();
      existingUser.phone = phone.trim();
      existingUser.password = hashedPassword;
      if (role && ['user', 'admin'].includes(role)) {
        existingUser.role = role;
      }
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();

      await sendOtpEmail(existingUser.email, existingUser.name, otp);

      return res.status(200).json({
        success: true,
        message: 'Account updated. A new 6-digit verification OTP has been sent (valid for 5 minutes).',
        email: existingUser.email,
        otp,
      });
    }

    // New user registration
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const newUser = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password: hashedPassword,
      role: role && ['user', 'admin'].includes(role) ? role : 'user',
      isVerified: false,
      isRestricted: false,
      otp,
      otpExpires,
    });

    await sendOtpEmail(newUser.email, newUser.name, otp);

    return res.status(201).json({
      success: true,
      message: 'Registration initiated. A 6-digit verification OTP has been sent (valid for 5 minutes).',
      email: newUser.email,
      otp,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP, set isVerified true, and issue JWT token
// @access  Public
router.post('/verify-otp', async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User account not found',
      });
    }

    if (user.isRestricted) {
      return res.status(403).json({
        success: false,
        message: 'This account has been restricted by an administrator.',
      });
    }

    if (!user.otp || !user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found. Please request a new OTP.',
      });
    }

    if (new Date() > user.otpExpires) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new OTP.',
      });
    }

    if (user.otp !== otp.toString().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP code. Please check and try again.',
      });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Account successfully verified.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isRestricted: user.isRestricted,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Generate a fresh 6-digit OTP and send
// @access  Public
router.post('/resend-otp', async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found with this email',
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Account is already verified. Please proceed to login.',
      });
    }

    if (user.isRestricted) {
      return res.status(403).json({
        success: false,
        message: 'This account has been restricted by an administrator.',
      });
    }

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    await sendOtpEmail(user.email, user.name, otp);

    return res.status(200).json({
      success: true,
      message: 'A fresh 6-digit OTP has been sent (valid for 5 minutes).',
      email: user.email,
      otp,
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Login user, check role match, verify isVerified & block isRestricted
// @access  Public
router.post('/login', async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify role match if role was specified in the request
    if (role && user.role !== role) {
      return res.status(403).json({
        success: false,
        message: `Role mismatch: This account is registered as '${user.role}', not '${role}'.`,
      });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Block login if restricted
    if (user.isRestricted) {
      return res.status(403).json({
        success: false,
        message: 'Your account has been restricted by an administrator. Please contact support.',
      });
    }

    // Block login if not verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        isVerified: false,
        message: 'Account not verified. Please verify your OTP first.',
        email: user.email,
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        isRestricted: user.isRestricted,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current authenticated user info
// @access  Private
router.get('/me', authenticate, async (req, res) => {
  return res.status(200).json({
    success: true,
    user: req.user,
  });
});

module.exports = router;
