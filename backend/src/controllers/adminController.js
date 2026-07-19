import bcrypt from 'bcryptjs';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';
import { Vehicle } from '../models/Vehicle.js';
import { Ride } from '../models/Ride.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const listEmployees = asyncHandler(async (req, res) => {
  const employees = await User.find({ organizationId: req.user.organizationId }).select('-password').sort({ createdAt: -1 });
  res.json(employees);
});

export const createEmployee = asyncHandler(async (req, res) => {
  const { name, email, phone = '0000000000', department, manager, location, role = 'Employee' } = req.body;

  if (!name || !email) {
    throw httpError(400, 'name and email are required');
  }

  const temporaryPassword = 'Password123';
  const user = await User.create({
    name,
    email,
    phone,
    department,
    manager,
    location,
    role,
    organizationId: req.user.organizationId,
    status: 'Active',
    password: await bcrypt.hash(temporaryPassword, 12)
  });

  res.status(201).json({
    message: 'Employee created',
    temporaryPassword,
    user: { ...user.toObject(), password: undefined }
  });
});

export const updateEmployeeAccess = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.user.organizationId },
    { $set: { status } },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw httpError(404, 'Employee not found');
  }

  res.json({ message: 'Employee access status updated.', user });
});

export const listAdminVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ organizationId: req.user.organizationId })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });
  res.json(vehicles);
});

export const createAdminVehicle = asyncHandler(async (req, res) => {
  const { ownerId, model, registrationNumber, seatingCapacity, fuelEfficiency } = req.body;
  const owner = await User.findOne({ _id: ownerId, organizationId: req.user.organizationId });

  if (!owner) {
    throw httpError(404, 'Owner employee not found');
  }

  const vehicle = await Vehicle.create({
    ownerId,
    organizationId: req.user.organizationId,
    model,
    registrationNumber,
    seatingCapacity,
    fuelEfficiency
  });

  res.status(201).json(vehicle);
});

export const updateVehicleStatus = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, organizationId: req.user.organizationId },
    { $set: { status: req.body.status } },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    throw httpError(404, 'Vehicle not found');
  }

  res.json(vehicle);
});

export const getSettings = asyncHandler(async (req, res) => {
  const [organization, registeredEmployees, registeredVehicles, ridesThisMonth] = await Promise.all([
    Organization.findById(req.user.organizationId),
    User.countDocuments({ organizationId: req.user.organizationId }),
    Vehicle.countDocuments({ organizationId: req.user.organizationId }),
    Ride.countDocuments({
      organizationId: req.user.organizationId,
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })
  ]);

  res.json({ organization, registeredEmployees, registeredVehicles, ridesThisMonth });
});

export const updateSettings = asyncHandler(async (req, res) => {
  const { name, industry, registeredAddress, adminContact, fuelCostPerLiter, costPerKm, operationalTravelCost } = req.body;
  const organization = await Organization.findByIdAndUpdate(
    req.user.organizationId,
    {
      $set: {
        name,
        industry,
        registeredAddress,
        adminContact,
        'configuration.fuelCostPerLiter': fuelCostPerLiter,
        'configuration.costPerKm': costPerKm,
        'configuration.operationalTravelCost': operationalTravelCost
      }
    },
    { new: true, runValidators: true }
  );

  res.json(organization);
});
