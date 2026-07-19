import mongoose from 'mongoose';

const savedPlaceSchema = new mongoose.Schema(
  {
    address: String,
    coordinates: { type: [Number], index: '2dsphere' }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    department: { type: String },
    manager: { type: String },
    location: { type: String },
    role: { type: String, enum: ['Employee', 'Admin'], default: 'Employee' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
    status: { type: String, enum: ['Pending', 'Active', 'Revoked', 'Rejected'], default: 'Pending' },
    savedPlaces: {
      home: savedPlaceSchema,
      office: savedPlaceSchema
    },
    walletBalance: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
