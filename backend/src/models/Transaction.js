import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    amount: { type: Number, required: true },
    type: { type: String, enum: ['Recharge', 'Fare Payment', 'Fare Earned', 'Payout'], required: true },
    method: { type: String, enum: ['Wallet', 'Cash', 'UPI', 'Card', 'Razorpay', 'Mock'] },
    status: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
    razorpayPaymentId: String,
    razorpayOrderId: String
  },
  { timestamps: true }
);

export const Transaction = mongoose.model('Transaction', transactionSchema);
