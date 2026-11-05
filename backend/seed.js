require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

const seedData = async () => {
  try {
    console.log('[Seeder] Checking database for existing initial data...');

    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@glowfix.gov' });
    let adminUser;

    if (!adminExists) {
      adminUser = await User.create({
        name: 'Municipal Admin Officer',
        email: 'admin@glowfix.gov',
        password: 'admin123',
        role: 'admin'
      });
      console.log('[Seeder] Admin created: admin@glowfix.gov / admin123');
    } else {
      adminUser = adminExists;
    }

    // Check if citizen exists
    const citizenExists = await User.findOne({ email: 'citizen@example.com' });
    let sampleCitizen;

    if (!citizenExists) {
      sampleCitizen = await User.create({
        name: 'Rahul Sharma',
        email: 'citizen@example.com',
        password: 'citizen123',
        role: 'citizen'
      });
      console.log('[Seeder] Sample citizen created: citizen@example.com / citizen123');
    } else {
      sampleCitizen = citizenExists;
    }

    // Check complaint count
    const complaintCount = await Complaint.countDocuments();
    if (complaintCount === 0) {
      const initialComplaints = [
        {
          complaintId: 'GF-102941',
          userId: sampleCitizen._id,
          citizenName: sampleCitizen.name,
          citizenEmail: sampleCitizen.email,
          streetLightId: 'SL-0421',
          location: 'MG Road, Opposite Central Park Gate 2',
          faultType: 'Not Working',
          description: 'The street light is completely dark after sunset. High pedestrian traffic area requiring urgent repair.',
          status: 'Pending',
          image: '',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          complaintId: 'GF-304812',
          userId: sampleCitizen._id,
          citizenName: sampleCitizen.name,
          citizenEmail: sampleCitizen.email,
          streetLightId: 'SL-0899',
          location: '14th Cross, Indiranagar 2nd Stage',
          faultType: 'Flickering',
          description: 'Street light rapidly flickers at night creating strobe-like glare and visibility danger for motorists.',
          status: 'In Progress',
          adminNotes: 'Field technician team #4 dispatched to inspect transformer and capacitor.',
          image: '',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          complaintId: 'GF-509124',
          userId: null,
          citizenName: 'Priya Sundaram',
          citizenEmail: 'priya.s@gmail.com',
          streetLightId: 'SL-0105',
          location: 'Outer Ring Road, Junction 4 Flyover Base',
          faultType: 'Damaged Pole',
          description: 'Pole tilted approximately 25 degrees following thunderstorm. Base plate bolts are visibly loosened.',
          status: 'Pending',
          image: '',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          complaintId: 'GF-708231',
          userId: sampleCitizen._id,
          citizenName: sampleCitizen.name,
          citizenEmail: sampleCitizen.email,
          streetLightId: 'SL-0312',
          location: 'Church Street, Near Metro Station Exit A',
          faultType: 'Dim Light',
          description: 'The yellow vapor lamp has aged significantly, barely producing sufficient lumen output.',
          status: 'Resolved',
          adminNotes: 'Replaced older 70W sodium bulb with new 90W Philips high-efficiency LED fixture. Tested OK.',
          resolvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          image: '',
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        },
        {
          complaintId: 'GF-902143',
          userId: null,
          citizenName: 'Amit Verma',
          citizenEmail: 'amit.v@yahoo.com',
          streetLightId: 'SL-0720',
          location: 'Brigade Road, Lane 3 Corner',
          faultType: 'Not Working',
          description: 'Trip switch failure in junction panel kept light unpowered.',
          status: 'Resolved',
          adminNotes: 'Junction box MCB switch replaced and feeder line tested. Fully operational.',
          resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          image: '',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ];

      await Complaint.insertMany(initialComplaints);
      console.log(`[Seeder] Seeded ${initialComplaints.length} realistic complaints.`);
    }

    console.log('[Seeder] Database initialized successfully!');
  } catch (error) {
    console.error('[Seeder] Error during seeding:', error);
  }
};

// Export for automatic invocation on server startup
module.exports = seedData;

// If run directly: node seed.js
if (require.main === module) {
  connectDB().then(async () => {
    await seedData();
    process.exit(0);
  });
}
