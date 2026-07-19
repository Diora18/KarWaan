import { ChatMessage } from '../models/ChatMessage.js';
import { Ride } from '../models/Ride.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { httpError } from '../utils/httpError.js';

export const getRideChats = asyncHandler(async (req, res) => {
  const { rideId } = req.params;

  // Optional: check if the user is authorized to view this ride's chat
  const ride = await Ride.findById(rideId);
  if (!ride) {
    throw httpError(404, 'Ride not found');
  }

  const isDriver = ride.driverId.toString() === req.user._id.toString();
  const isPassenger = ride.passengers.some(p => p.userId.toString() === req.user._id.toString());

  if (!isDriver && !isPassenger && req.user.role !== 'Admin') {
    throw httpError(403, 'Not authorized to view this chat');
  }

  const chats = await ChatMessage.find({ rideId })
    .populate('senderId', 'name')
    .sort({ createdAt: 1 });

  // Format response so it looks like the socket payload
  const formatted = chats.map(chat => ({
    _id: chat._id,
    rideId: chat.rideId,
    senderId: chat.senderId._id,
    senderName: chat.senderId.name,
    text: chat.text,
    createdAt: chat.createdAt
  }));

  res.json(formatted);
});
