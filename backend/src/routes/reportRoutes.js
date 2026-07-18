import { Router } from 'express';
import { reportSummary } from '../controllers/reportController.js';

export const reportRoutes = Router();

reportRoutes.get('/summary', reportSummary);
