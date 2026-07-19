import { Router } from 'express';
import {
  createAdminVehicle,
  createEmployee,
  getSettings,
  listAdminVehicles,
  listEmployees,
  updateEmployeeAccess,
  updateSettings,
  updateVehicleStatus
} from '../controllers/adminController.js';

export const adminRoutes = Router();

adminRoutes.get('/employees', listEmployees);
adminRoutes.post('/employees', createEmployee);
adminRoutes.patch('/employees/:id/access', updateEmployeeAccess);
adminRoutes.get('/vehicles', listAdminVehicles);
adminRoutes.post('/vehicles', createAdminVehicle);
adminRoutes.patch('/vehicles/:id/status', updateVehicleStatus);
adminRoutes.get('/settings', getSettings);
adminRoutes.put('/settings', updateSettings);
