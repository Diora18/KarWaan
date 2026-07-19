import { Organization } from '../models/Organization.js';

const defaultOrganizations = [
  {
    name: 'Odoo Pvt. Ltd.',
    domain: 'odoo.com',
    industry: 'Software',
    registeredAddress: 'Gandhinagar',
    adminContact: 'admin@odoo.com'
  },
  {
    name: 'Google LLC',
    domain: 'google.com',
    industry: 'Technology',
    registeredAddress: 'Mountain View',
    adminContact: 'admin@google.com'
  }
];

export async function ensureDefaultOrganizations() {
  const organizationCount = await Organization.countDocuments();

  if (organizationCount > 0) {
    return false;
  }

  await Organization.insertMany(defaultOrganizations, { ordered: false });
  return true;
}
