import { Router } from 'express';
import { createMyVehicle, deleteMyVehicle, listMyVehicles, updateMyVehicle } from '../controllers/vehicleController.js';

export const vehicleRoutes = Router();

vehicleRoutes.get('/', listMyVehicles);
vehicleRoutes.post('/', createMyVehicle);
vehicleRoutes.patch('/:id', updateMyVehicle);
vehicleRoutes.delete('/:id', deleteMyVehicle);
