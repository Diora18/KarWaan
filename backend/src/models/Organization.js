import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    domain: { type: String, required: true, trim: true, lowercase: true },
    industry: { type: String, default: 'Software' },
    registeredAddress: { type: String },
    adminContact: { type: String, required: true, trim: true, lowercase: true },
    configuration: {
      fuelCostPerLiter: { type: Number, default: 96.5 },
      costPerKm: { type: Number, default: 8 },
      operationalTravelCost: { type: Number, default: 2.5 }
    }
  },
  { timestamps: true }
);

export const Organization = mongoose.model('Organization', organizationSchema);
