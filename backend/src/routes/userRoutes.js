import { Router } from 'express';
import { getProfile, getSavedPlaces, updateSavedPlaces } from '../controllers/userController.js';

export const userRoutes = Router();

userRoutes.get('/profile', getProfile);
userRoutes.get('/saved-places', getSavedPlaces);
userRoutes.put('/saved-places', updateSavedPlaces);
