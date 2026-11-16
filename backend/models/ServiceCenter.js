const mongoose = require('mongoose');

const serviceCenterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service center name is required'],
      trim: true,
    },
    contactNumber: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ServiceCenter', serviceCenterSchema);
