import { Router } from 'express';
import { listTransactions, rechargeWallet } from '../controllers/walletController.js';

export const walletRoutes = Router();

walletRoutes.get('/transactions', listTransactions);
walletRoutes.post('/recharge', rechargeWallet);
