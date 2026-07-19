import express from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { User } from '../models/User.js'
import { Transaction } from '../models/Transaction.js'
import { requireAuth } from '../middleware/auth.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { payRideFare } from '../controllers/paymentController.js'

const router = express.Router()

// Utility to get Razorpay instance lazily in case keys are added later
const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys not configured in environment variables')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

router.post('/ride-fare', requireAuth, payRideFare)

/**
 * @route POST /api/payment/create-order
 * @desc Create a Razorpay order for wallet top-up
 * @access Private
 */
router.post('/create-order', requireAuth, asyncHandler(async (req, res) => {
  const { amount } = req.body
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Valid amount is required' })
  }

  const instance = getRazorpayInstance()

  const options = {
    amount: Math.round(amount * 100), // Razorpay expects amount in paise, ensure it's integer
    currency: 'INR',
    receipt: `rcpt_${req.user._id.toString().substring(0, 6)}_${Date.now()}`
  }

  try {
    const order = await instance.orders.create(options)
    
    if (!order) {
      return res.status(500).json({ message: 'Some error occurred creating Razorpay order' })
    }

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    })
  } catch (error) {
    console.error('Razorpay Error:', error);
    return res.status(500).json({ 
      message: error.description || error.error?.description || error.message || 'Razorpay order creation failed' 
    })
  }
}))

/**
 * @route POST /api/payment/verify
 * @desc Verify Razorpay payment signature and update user wallet
 * @access Private
 */
router.post('/verify', requireAuth, asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body

  if (!process.env.RAZORPAY_KEY_SECRET) {
    return res.status(500).json({ message: 'Razorpay secret not configured' })
  }

  // Generate signature using crypto
  const body = razorpay_order_id + '|' + razorpay_payment_id
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex')

  const isAuthentic = expectedSignature === razorpay_signature

  if (isAuthentic) {
    // 1. Update user's wallet
    const user = await User.findById(req.user._id)
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.walletBalance += Number(amount)
    await user.save()

    // 2. Log transaction
    await Transaction.create({
      userId: user._id,
      type: 'Recharge',
      method: 'Razorpay',
      amount: Number(amount),
      balanceAfter: user.walletBalance,
      razorpayPaymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      description: 'Added funds via Razorpay'
    })

    res.json({
      success: true,
      message: 'Payment successful, wallet updated.',
      newBalance: user.walletBalance
    })
  } else {
    res.status(400).json({
      success: false,
      message: 'Payment verification failed (invalid signature).'
    })
  }
}))

export const paymentRoutes = router
