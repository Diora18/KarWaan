import { Vehicle } from '../models/Vehicle.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const listMyVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({ ownerId: req.user._id }).sort({ createdAt: -1 });
  res.json(vehicles);
});

export const createMyVehicle = asyncHandler(async (req, res) => {
  const { model, registrationNumber, seatingCapacity, fuelEfficiency } = req.body;

  if (!model || !registrationNumber || !seatingCapacity) {
    throw httpError(400, 'model, registrationNumber, and seatingCapacity are required');
  }

  const vehicle = await Vehicle.create({
    ownerId: req.user._id,
    organizationId: req.user.organizationId,
    model,
    registrationNumber,
    seatingCapacity,
    fuelEfficiency
  });

  res.status(201).json(vehicle);
});

export const updateMyVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!vehicle) {
    throw httpError(404, 'Vehicle not found');
  }

  res.json(vehicle);
});

export const deleteMyVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOneAndUpdate(
    { _id: req.params.id, ownerId: req.user._id },
    { $set: { status: 'Inactive' } },
    { new: true }
  );

  if (!vehicle) {
    throw httpError(404, 'Vehicle not found');
  }

  res.json({ message: 'Vehicle deactivated', vehicle });
});
