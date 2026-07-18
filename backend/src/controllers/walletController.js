import { Transaction } from '../models/Transaction.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const listTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(transactions);
});

export const rechargeWallet = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  if (!amount || Number(amount) <= 0) {
    throw httpError(400, 'A positive amount is required');
  }

  // MOCK RECHARGE: Directly increment the balance for testing purposes.
  // In the future, this will create a Razorpay order instead.
  
  const user = await User.findByIdAndUpdate(
    req.user._id, 
    { $inc: { walletBalance: Number(amount) } },
    { new: true }
  );

  const transaction = await Transaction.create({
    userId: req.user._id,
    amount,
    type: 'Recharge',
    method: 'Mock',
    status: 'Success'
  });

  res.status(201).json({ message: 'Wallet recharged successfully', transaction, newBalance: user.walletBalance });
});
