import { Router } from 'express';
import { listOrganizations } from '../controllers/organizationController.js';

export const organizationRoutes = Router();

organizationRoutes.get('/', listOrganizations);
