const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Alert title is required'],
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true,
  },
  severity: {
    type: String,
    enum: ['warning', 'critical'],
    default: 'warning',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Alert', alertSchema);
