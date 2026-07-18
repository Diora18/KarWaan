import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { connectDb } from './config/db.js';
import { registerSocketHandlers } from './services/socketService.js';
import { ensureDefaultOrganizations } from './utils/defaultOrganizations.js';

const port = process.env.PORT || 5000;
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      callback(null, isAllowedOrigin(origin));
    },
    credentials: true
  }
});

registerSocketHandlers(io);

connectDb()
  .then(() => {
    return ensureDefaultOrganizations();
  })
  .then(() => {
    server.listen(port, () => {
      console.log(`KarWaan backend running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  });
