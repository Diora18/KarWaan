import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDb } from './config/db.js';
import { ChatMessage } from './models/ChatMessage.js';
import { Ride } from './models/Ride.js';
import { Transaction } from './models/Transaction.js';
import { User } from './models/User.js';
import { Vehicle } from './models/Vehicle.js';
import { ensureDefaultOrganizations } from './utils/defaultOrganizations.js';
import { Organization } from './models/Organization.js';

async function seed() {
  await connectDb();

  await Promise.all([
    ChatMessage.deleteMany({}),
    Ride.deleteMany({}),
    Transaction.deleteMany({}),
    Vehicle.deleteMany({}),
    User.deleteMany({}),
    Organization.deleteMany({})
  ]);

  await ensureDefaultOrganizations();

  const organization = await Organization.findOne({ domain: 'odoo.com' });

  const password = await bcrypt.hash('Password123', 12);
  const [admin, activeEmployee, pendingEmployee, revokedEmployee] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@odoo.com',
      password,
      phone: '9999999999',
      role: 'Admin',
      organizationId: organization._id,
      status: 'Active',
      department: 'Operations',
      location: 'Gandhinagar'
    },
    {
      name: 'Khush Patel',
      email: 'khush@odoo.com',
      password,
      phone: '9876543210',
      role: 'Employee',
      organizationId: organization._id,
      status: 'Active',
      department: 'Engineering',
      manager: 'Admin User',
      location: 'Gandhinagar',
      walletBalance: 1000,
      savedPlaces: {
        home: { address: 'Sector 1, Gandhinagar', coordinates: [72.6369, 23.2156] },
        office: { address: 'Odoo Office, Gandhinagar', coordinates: [72.5276, 23.0351] }
      }
    },
    {
      name: 'Pending Employee',
      email: 'pending@odoo.com',
      password,
      phone: '9000000001',
      role: 'Employee',
      organizationId: organization._id,
      status: 'Pending',
      department: 'QA',
      location: 'Gandhinagar'
    },
    {
      name: 'Revoked Employee',
      email: 'revoked@odoo.com',
      password,
      phone: '9000000002',
      role: 'Employee',
      organizationId: organization._id,
      status: 'Revoked',
      department: 'Support',
      location: 'Gandhinagar'
    }
  ]);

  const [vehicleOne, vehicleTwo] = await Vehicle.create([
    {
      ownerId: activeEmployee._id,
      organizationId: organization._id,
      model: 'Honda City',
      registrationNumber: 'GJ01AB1234',
      seatingCapacity: 4,
      fuelEfficiency: 16,
      status: 'Active'
    },
    {
      ownerId: activeEmployee._id,
      organizationId: organization._id,
      model: 'Maruti Baleno',
      registrationNumber: 'GJ01CD5678',
      seatingCapacity: 3,
      fuelEfficiency: 19,
      status: 'Inactive'
    }
  ]);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  const ride = await Ride.create({
    organizationId: organization._id,
    driverId: activeEmployee._id,
    vehicleId: vehicleOne._id,
    pickupLocation: { address: 'Sector 1, Gandhinagar', coordinates: [72.6369, 23.2156] },
    destinationLocation: { address: 'Odoo Office, Gandhinagar', coordinates: [72.5276, 23.0351] },
    departureTime: tomorrow,
    availableSeats: 3,
    farePerSeat: 80,
    status: 'Scheduled'
  });

  await ChatMessage.create({
    rideId: ride._id,
    senderId: activeEmployee._id,
    senderName: activeEmployee.name,
    text: 'Seed chat message for frontend testing.'
  });

  await Transaction.create({
    userId: activeEmployee._id,
    amount: 1000,
    type: 'Recharge',
    method: 'Razorpay',
    status: 'Success',
    razorpayOrderId: 'seed_order'
  });

  console.log('Seed complete.');
  console.log('Admin login: admin@odoo.com / Password123');
  console.log('Employee login: khush@odoo.com / Password123');

  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
