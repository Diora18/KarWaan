import jwt from 'jsonwebtoken';
import Redis from 'ioredis';
import { ChatMessage } from '../models/ChatMessage.js';
import { Ride } from '../models/Ride.js';
import { User } from '../models/User.js';

let redis;

function getRedis() {
  if (!redis && process.env.REDIS_URL) {
    redis = new Redis(process.env.REDIS_URL, { lazyConnect: true });
  }

  return redis;
}

export function registerSocketHandlers(io) {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        throw new Error('Socket auth token is required');
      }

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(payload.userId).select('-password');
      if (!user || user.status !== 'Active') {
        throw new Error('Socket user is not active');
      }

      socket.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on('connection', (socket) => {
    socket.on('join_ride_room', async ({ rideId }, callback) => {
      const room = `ride:${rideId}`;
      socket.join(room);

      const ride = await Ride.findById(rideId);
      const lastTelemetry = await readTelemetry(rideId);

      callback?.({
        status: 'success',
        message: `Joined room ${room}`,
        initialState: {
          status: ride?.status,
          lastTelemetry
        }
      });
    });

    socket.on('send_location', async ({ rideId, coordinates, bearing, speed, etaMinutes }) => {
      const [lng, lat] = coordinates || [];
      const updatedAt = new Date().toISOString();
      const redisClient = getRedis();

      if (redisClient) {
        await redisClient.connect().catch(() => undefined);
        await redisClient.hset(`ride:telemetry:${rideId}`, {
          lng,
          lat,
          bearing,
          speed,
          etaMinutes,
          updatedAt
        });
        await redisClient.expire(`ride:telemetry:${rideId}`, 86400);
        await redisClient.geoadd('active_rides', lng, lat, rideId);
      }

      socket.to(`ride:${rideId}`).emit('location_update', {
        rideId,
        coordinates,
        bearing,
        etaMinutes,
        updatedAt
      });
    });

    socket.on('send_chat_message', async ({ rideId, message }) => {
      const chat = await ChatMessage.create({
        rideId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        message
      });

      io.to(`ride:${rideId}`).emit('chat_message_received', {
        _id: chat._id,
        rideId,
        senderId: socket.user._id,
        senderName: socket.user.name,
        message: chat.message,
        createdAt: chat.createdAt
      });
    });
  });
}

async function readTelemetry(rideId) {
  const redisClient = getRedis();
  if (!redisClient) {
    return null;
  }

  await redisClient.connect().catch(() => undefined);
  const telemetry = await redisClient.hgetall(`ride:telemetry:${rideId}`);

  if (!telemetry || !telemetry.lng) {
    return null;
  }

  return {
    coordinates: [Number(telemetry.lng), Number(telemetry.lat)],
    bearing: Number(telemetry.bearing || 0),
    etaMinutes: Number(telemetry.etaMinutes || 0),
    updatedAt: telemetry.updatedAt
  };
}
