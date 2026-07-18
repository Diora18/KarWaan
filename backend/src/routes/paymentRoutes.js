import { Router } from 'express';
import { payRideFare } from '../controllers/paymentController.js';

export const paymentRoutes = Router();

paymentRoutes.post('/ride-fare', payRideFare);
