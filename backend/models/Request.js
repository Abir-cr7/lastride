const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true,
  },
  userPhone: {
    type: String,
    required: [true, 'User phone is required'],
    trim: true,
  },
  type: {
    type: String,
    enum: ['fuel_order', 'emergency_rescue'],
    required: [true, 'Request type is required'],
  },
  fuelType: {
    type: String,
    enum: ['Petrol', 'Diesel', 'Octane', null, ''],
    default: null,
  },
  quantity: {
    type: Number,
    default: null,
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required'],
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed'],
    default: 'pending',
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: null,
  },
  review: {
    type: String,
    trim: true,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Request', requestSchema);
