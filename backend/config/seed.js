const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Fuel = require('../models/Fuel');
const ServiceCenter = require('../models/ServiceCenter');

const seedDatabase = async () => {
  try {
    // 1. Seed default verified admin
    const adminEmail = 'admin@riderrescue.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await User.create({
        name: 'Super Admin',
        email: adminEmail,
        phone: '+8801700000000',
        password: hashedPassword,
        role: 'admin',
        isVerified: true,
        isRestricted: false,
      });
      console.log('✅ Default verified admin created (admin@riderrescue.com / admin123)');
    } else {
      console.log('ℹ️ Admin user already exists');
    }

    // 2. Seed initial fuels if empty
    const fuelCount = await Fuel.countDocuments();
    if (fuelCount === 0) {
      const initialFuels = [
        { name: 'Petrol', pricePerLiter: 125, unit: 'Liter' },
        { name: 'Diesel', pricePerLiter: 105, unit: 'Liter' },
        { name: 'Octane', pricePerLiter: 130, unit: 'Liter' },
      ];
      await Fuel.insertMany(initialFuels);
      console.log('✅ Seeded initial fuels (Petrol, Diesel, Octane)');
    } else {
      console.log(`ℹ️ Fuel collection has ${fuelCount} items`);
    }

    // 3. Seed 4 service centers around Ashulia/Dhaka if empty
    const serviceCenterCount = await ServiceCenter.countDocuments();
    if (serviceCenterCount === 0) {
      const initialCenters = [
        {
          name: 'Ashulia Highway Rescue & Service',
          contactNumber: '+8801711122233',
          address: 'Baipail Bypass, Ashulia, Dhaka',
          lat: 23.9315,
          lng: 90.2707,
        },
        {
          name: 'Savar Rider Helpdesk & Garage',
          contactNumber: '+8801722233344',
          address: 'Nabinagar Bus Stand, Savar, Dhaka',
          lat: 23.9142,
          lng: 90.2602,
        },
        {
          name: 'Uttara Quick Response Hub',
          contactNumber: '+8801733344455',
          address: 'Sector 11, Uttara, Dhaka',
          lat: 23.8759,
          lng: 90.3795,
        },
        {
          name: 'Mirpur Emergency Moto Care',
          contactNumber: '+8801744455566',
          address: 'Mirpur 10 Roundabout, Dhaka',
          lat: 23.8069,
          lng: 90.3687,
        },
      ];
      await ServiceCenter.insertMany(initialCenters);
      console.log('✅ Seeded 4 service centers around Ashulia/Dhaka');
    } else {
      console.log(`ℹ️ ServiceCenter collection has ${serviceCenterCount} items`);
    }
  } catch (error) {
    console.error('❌ Error during database seeding:', error.message);
  }
};

module.exports = seedDatabase;
