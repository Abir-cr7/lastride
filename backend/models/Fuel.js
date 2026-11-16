const mongoose = require('mongoose');

const fuelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Fuel name is required'],
    enum: ['Petrol', 'Diesel', 'Octane'],
    unique: true,
  },
  pricePerLiter: {
    type: Number,
    required: [true, 'Price per liter is required'],
    min: [0, 'Price must be positive'],
  },
  unit: {
    type: String,
    default: 'Liter',
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

fuelSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  if (typeof next === 'function') next();
});

module.exports = mongoose.model('Fuel', fuelSchema);
