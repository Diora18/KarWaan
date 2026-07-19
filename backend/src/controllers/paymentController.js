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
  
  if (passenger.paymentStatus === 'Paid') {
    throw httpError(400, 'Fare already paid for this ride');
  }
  
  if (passenger.paymentStatus === 'Pending') {
    throw httpError(400, 'Cash payment is already pending confirmation from driver');
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

    passenger.farePaid = amount;
    passenger.paymentMethod = 'Wallet';
    passenger.paymentStatus = 'Paid';
    await ride.save();

    // Create debit transaction for passenger
    const passengerTx = await Transaction.create({
      userId: req.user._id,
      amount: -amount,
      type: 'Fare Payment',
      method: 'Wallet',
      status: 'Success'
    });

    // Create credit transaction for driver
    await Transaction.create({
      userId: ride.driverId,
      amount: amount,
      type: 'Fare Earned',
      method: 'Wallet',
      status: 'Success'
    });

    return res.status(201).json({ message: 'Ride fare paid via Wallet', transaction: passengerTx });
  } else if (method === 'Cash') {
    passenger.paymentMethod = 'Cash';
    passenger.paymentStatus = 'Pending';
    await ride.save();
    
    return res.status(200).json({ message: 'Cash payment requested. Waiting for driver confirmation.' });
  } else {
    throw httpError(400, 'Invalid payment method');
  }
});

export const confirmCashPayment = asyncHandler(async (req, res) => {
  const { rideId, passengerId } = req.body;

  const ride = await Ride.findOne({ _id: rideId, driverId: req.user._id });
  if (!ride) {
    throw httpError(404, 'Ride not found or you are not the driver');
  }

  const passenger = ride.passengers.find(p => p.userId.toString() === passengerId.toString());
  if (!passenger) {
    throw httpError(404, 'Passenger not found in this ride');
  }

  if (passenger.paymentMethod !== 'Cash' || passenger.paymentStatus !== 'Pending') {
    throw httpError(400, 'No pending cash payment for this passenger');
  }

  const amount = Number(ride.farePerSeat * passenger.seatsBooked);
  
  passenger.farePaid = amount;
  passenger.paymentStatus = 'Paid';
  await ride.save();

  // Create debit transaction for passenger (to keep history)
  await Transaction.create({
    userId: passenger.userId,
    amount: -amount,
    type: 'Fare Payment',
    method: 'Cash',
    status: 'Success'
  });

  // Create credit transaction for driver (to keep history)
  await Transaction.create({
    userId: ride.driverId,
    amount: amount,
    type: 'Fare Earned',
    method: 'Cash',
    status: 'Success'
  });

  res.status(200).json({ message: 'Cash payment confirmed' });
});
