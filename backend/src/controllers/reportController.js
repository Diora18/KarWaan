import { Ride } from '../models/Ride.js';
import { Vehicle } from '../models/Vehicle.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const reportSummary = asyncHandler(async (req, res) => {
  const [rides, vehicles] = await Promise.all([
    Ride.find({ $or: [{ driverId: req.user._id }, { 'passengers.userId': req.user._id }] }),
    Vehicle.find({ ownerId: req.user._id })
  ]);

  const totalTrips = rides.length;
  
  let totalFarePaid = 0;
  rides.forEach(ride => {
    const passengerRecord = ride.passengers.find(p => p.userId.toString() === req.user._id.toString());
    if (passengerRecord) {
      totalFarePaid += Number(passengerRecord.farePaid || 0);
    }
  });

  res.json({
    totalTrips,
    totalDistanceTravelled: 0, // Telemetry disabled
    totalFarePaid,
    costPerKilometer: 0,
    estimatedFuelConsumption: 0,
    vehicleCount: vehicles.length
  });
});
