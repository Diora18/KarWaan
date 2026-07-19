import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

function signToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      organizationId: user.organizationId,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, organizationId, department, manager, location } = req.body;

  if (!name || !email || !password || !phone || !organizationId) {
    throw httpError(400, 'name, email, password, phone, and organizationId are required');
  }

  const organization = await Organization.findById(organizationId);
  if (!organization) {
    throw httpError(404, 'Organization not found');
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!normalizedEmail.endsWith(`@${organization.domain}`)) {
    throw httpError(400, `Email must match organization domain @${organization.domain}`);
  }

  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    throw httpError(409, 'User already exists');
  }

  const isAdmin = normalizedEmail === organization.adminContact;
  
  const hashedPassword = await bcrypt.hash(password, 12);
  await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    organizationId,
    department,
    manager,
    location,
    role: isAdmin ? 'Admin' : 'Employee',
    status: isAdmin ? 'Active' : 'Pending'
  });

  res.status(201).json({ message: 'Registration submitted. Waiting for Admin approval.' });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, organizationId } = req.body;

  if (!email || !password || !organizationId) {
    throw httpError(400, 'email, password, and organizationId are required');
  }

  const user = await User.findOne({ email: email.toLowerCase().trim(), organizationId });
  if (!user) {
    throw httpError(401, 'Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw httpError(401, 'Invalid credentials');
  }

  if (user.status === 'Pending') {
    throw httpError(403, 'Your registration request is pending admin approval.');
  }

  if (user.status === 'Revoked' || user.status === 'Rejected') {
    throw httpError(403, 'Your access has been revoked by your Organization Administrator.');
  }

  const token = signToken(user);
  res.json({
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      organizationId: user.organizationId
    }
  });
});
