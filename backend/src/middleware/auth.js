import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { httpError } from '../utils/httpError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw httpError(401, 'Authorization token is required');
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(payload.userId).select('-password');

  if (!user || user.status !== 'Active') {
    throw httpError(401, 'User is not active or no longer exists');
  }

  req.user = user;
  next();
});

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'Admin') {
    next(httpError(403, 'Admin access required'));
    return;
  }

  next();
}
