import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getProfile = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

export const getSavedPlaces = asyncHandler(async (req, res) => {
  res.json(req.user.savedPlaces || {});
});

export const updateSavedPlaces = asyncHandler(async (req, res) => {
  const allowed = {};

  for (const key of ['home', 'office']) {
    if (req.body[key]) {
      allowed[`savedPlaces.${key}`] = req.body[key];
    }
  }

  const user = await User.findByIdAndUpdate(req.user._id, { $set: allowed }, { new: true }).select('-password');
  res.json(user.savedPlaces || {});
});
