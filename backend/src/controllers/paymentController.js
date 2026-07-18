import { Ride } from '../models/Ride.js';
import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const payRideFare = asyncHandler(async (req, res) => {
  const { rideId, method = 'Wallet' } = req.body;
  
  const ride = await Ride.findOne({ _id: rideId, 'passengers.userId': req.user._id });
  if (!ride) {
    throw httpError(404, 'Ride or passenger record not found');
  }

  const passenger = ride.passengers.find(p => p.userId.toString() === req.user._id.toString());
  
  if (passenger.farePaid > 0) {
    throw httpError(400, 'Fare already paid for this ride');
  }

  const amount = Number(ride.farePerSeat * passenger.seatsBooked);
  
  if (method === 'Wallet') {
    // 1. Deduct from passenger
    const user = await User.findOneAndUpdate(
      { _id: req.user._id, walletBalance: { $gte: amount } },
      { $inc: { walletBalance: -amount } },
      { new: true }
    );

    if (!user) {
      throw httpError(400, 'Insufficient wallet balance');
    }

    // 2. Credit the driver
    await User.findByIdAndUpdate(ride.driverId, {
      $inc: { walletBalance: amount }
    });
  }

  passenger.farePaid = amount;
  await ride.save();

  // Create debit transaction for passenger
  const passengerTx = await Transaction.create({
    userId: req.user._id,
    amount: -amount,
    type: 'Fare Payment',
    method,
    status: 'Success'
  });

  // Create credit transaction for driver
  await Transaction.create({
    userId: ride.driverId,
    amount: amount,
    type: 'Fare Earned',
    method,
    status: 'Success'
  });

  res.status(201).json({ message: 'Ride fare payment recorded', transaction: passengerTx });
});
