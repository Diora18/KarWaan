import { Router } from 'express';
import { publishRide, searchRides, bookRide, myRides, updateRideStatus } from '../controllers/rideController.js';

export const rideRoutes = Router();

rideRoutes.get('/search', searchRides);
rideRoutes.post('/publish', publishRide);
rideRoutes.post('/book', bookRide);
rideRoutes.get('/my', myRides);
rideRoutes.patch('/:id/status', updateRideStatus);
