import { Organization } from '../models/Organization.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listOrganizations = asyncHandler(async (req, res) => {
  const organizations = await Organization.find().select('_id name domain');
  res.json(organizations);
});
