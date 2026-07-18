import { Router } from 'express';
import { getRideChats } from '../controllers/chatController.js';

export const chatRoutes = Router();

chatRoutes.get('/:rideId', getRideChats);
