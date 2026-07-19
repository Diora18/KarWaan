import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
  {
    address: { type: String, required: true },
    coordinates: { type: [Number] } // optional, no longer indexed for 2dsphere
  },
  { _id: false }
);

const passengerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    seatsBooked: { type: Number, required: true, min: 1 },
    farePaid: { type: Number, default: 0 }, // store how much they paid when booking
    paymentMethod: { type: String, enum: ['Wallet', 'Cash', 'None'], default: 'None' },
    paymentStatus: { type: String, enum: ['Unpaid', 'Pending', 'Paid'], default: 'Unpaid' }
  },
  { _id: false }
);

const rideSchema = new mongoose.Schema(
  {
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    pickupLocation: locationSchema,
    destinationLocation: locationSchema,
    departureTime: { type: Date, required: true },
    availableSeats: { type: Number, required: true, min: 0 },
    farePerSeat: { type: Number, required: true, min: 0 },
    passengers: [passengerSchema], // Track all passengers directly on the Ride
    isRecurring: { type: Boolean, default: false },
    recurringDays: [{ type: String }],
    status: { type: String, enum: ['Scheduled', 'Active', 'Completed', 'Cancelled'], default: 'Scheduled' },
    startedAt: { type: Date },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

export const Ride = mongoose.model('Ride', rideSchema);
