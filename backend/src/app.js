import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { adminRoutes } from './routes/adminRoutes.js';
import { authRoutes } from './routes/authRoutes.js';
import { organizationRoutes } from './routes/organizationRoutes.js';
import { paymentRoutes } from './routes/paymentRoutes.js';
import { reportRoutes } from './routes/reportRoutes.js';
import { rideRoutes } from './routes/rideRoutes.js';
import { userRoutes } from './routes/userRoutes.js';
import { vehicleRoutes } from './routes/vehicleRoutes.js';
import { walletRoutes } from './routes/walletRoutes.js';
import { chatRoutes } from './routes/chatRoutes.js';
import { requireAdmin, requireAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

const allowedOrigins = new Set([
  process.env.CLIENT_URL,
  'http://localhost:4173',
  'http://localhost:4174',
  'http://127.0.0.1:4173',
  'http://127.0.0.1:4174'
].filter(Boolean));

function isAllowedOrigin(origin) {
  if (!origin) {
    return true;
  }

  if (allowedOrigins.has(origin)) {
    return true;
  }

  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true
  })
);
app.use(express.json());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'karwaan-backend' });
});

app.use('/api/organizations', organizationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', requireAuth, userRoutes);
app.use('/api/vehicles', requireAuth, vehicleRoutes);
app.use('/api/rides', requireAuth, rideRoutes);
app.use('/api/wallet', requireAuth, walletRoutes);
app.use('/api/payments', requireAuth, paymentRoutes);
app.use('/api/chats', requireAuth, chatRoutes);
app.use('/api/reports', requireAuth, reportRoutes);
app.use('/api/admin', requireAuth, requireAdmin, adminRoutes);

app.use(notFound);
app.use(errorHandler);
