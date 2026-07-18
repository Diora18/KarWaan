import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    model: { type: String, required: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
    seatingCapacity: { type: Number, required: true, min: 1 },
    fuelEfficiency: { type: Number },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
  },
  { timestamps: true }
);

export const Vehicle = mongoose.model('Vehicle', vehicleSchema);
