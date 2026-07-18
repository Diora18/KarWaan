import { Ride } from '../models/Ride.js';
import { Vehicle } from '../models/Vehicle.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const searchRides = asyncHandler(async (req, res) => {
  const { date, seats = 1 } = req.query;

  if (!date) {
    throw httpError(400, 'date is required');
  }

  const searchDate = new Date(date);
  const startOfDay = new Date(searchDate);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(searchDate);
  endOfDay.setHours(23, 59, 59, 999);

  const rides = await Ride.find({
    organizationId: req.user.organizationId,
    driverId: { $ne: req.user._id },
    availableSeats: { $gte: Number(seats) },
    departureTime: { $gte: startOfDay, $lte: endOfDay },
    status: 'Scheduled'
  })
    .populate('driverId', 'name phone')
    .populate('vehicleId', 'model registrationNumber seatingCapacity')
    .sort({ departureTime: 1 });

  res.json(rides);
});

export const publishRide = asyncHandler(async (req, res) => {
  const {
    vehicleId,
    pickupLocation,
    destinationLocation,
    departureTime,
    availableSeats,
    farePerSeat,
    isRecurring = false,
    recurringDays = []
  } = req.body;

  const vehicle = await Vehicle.findOne({
    _id: vehicleId,
    ownerId: req.user._id,
    organizationId: req.user.organizationId,
    status: 'Active'
  });

  if (!vehicle) {
    throw httpError(400, 'An active vehicle owned by the user is required');
  }

  if (Number(availableSeats) > vehicle.seatingCapacity) {
    throw httpError(400, 'Available seats cannot exceed vehicle seating capacity');
  }

  const ride = await Ride.create({
    organizationId: req.user.organizationId,
    driverId: req.user._id,
    vehicleId,
    pickupLocation,
    destinationLocation,
    departureTime,
    availableSeats,
    farePerSeat,
    passengers: [], // initialize empty array
    isRecurring,
    recurringDays
  });

  res.status(201).json(ride);
});

export const bookRide = asyncHandler(async (req, res) => {
  const { rideId, seatsBooked = 1 } = req.body;

  const ride = await Ride.findOneAndUpdate(
    {
      _id: rideId,
      organizationId: req.user.organizationId,
      status: 'Scheduled',
      availableSeats: { $gte: Number(seatsBooked) }
    },
    { 
      $inc: { availableSeats: -Number(seatsBooked) },
      $push: { passengers: { userId: req.user._id, seatsBooked: Number(seatsBooked), farePaid: 0 } }
    },
    { new: true }
  );

  if (!ride) {
    throw httpError(400, 'Ride is not available for booking');
  }

  res.status(201).json(ride);
});

export const myRides = asyncHandler(async (req, res) => {
  const rides = await Ride.find({
    $or: [{ driverId: req.user._id }, { 'passengers.userId': req.user._id }]
  })
    .populate('driverId', 'name phone')
    .populate('vehicleId', 'model registrationNumber seatingCapacity')
    .populate('passengers.userId', 'name phone')
    .sort({ departureTime: -1 });

  res.json(rides);
});

export const updateRideStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const ride = await Ride.findById(req.params.id);

  if (!ride) {
    throw httpError(404, 'Ride not found');
  }

  const isDriver = ride.driverId.toString() === req.user._id.toString();
  if (!isDriver && req.user.role !== 'Admin') {
    throw httpError(403, 'Only the driver or admin can update ride status');
  }

  ride.status = status;
  if (status === 'Active') {
    ride.startedAt = new Date();
  }
  if (status === 'Completed') {
    ride.completedAt = new Date();
  }

  await ride.save();
  res.json(ride);
});
