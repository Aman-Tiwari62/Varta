import jwt from 'jsonwebtoken';
import Message from '../models/message.model.js';
import Conversation from '../models/conversation.model.js';

// Store active user connections: { userId: socketId }
const userConnections = {};

// Socket authentication middleware
const authenticateSocket = (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    console.log('🔐 Auth attempt with token:', token ? 'present' : 'missing');

    if (!token || !token.startsWith('Bearer ')) {
      console.error('❌ Invalid token format');
      throw new Error('No valid token provided');
    }

    const actualToken = token.split(' ')[1];
    const decoded = jwt.verify(actualToken, process.env.JWT_ACCESS_SECRET);

    socket.userId = decoded.userId;
    console.log('✅ Socket authenticated for user:', decoded.userId);
    next();
  } catch (error) {
    console.error('❌ Socket auth error:', error.message);
    next(new Error('Authentication failed: ' + error.message));
  }
};

export const initializeSocket = (io) => {
  // Apply authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`✅ User ${socket.userId} connected with socket ${socket.id}`);

    // Store user connection
    userConnections[socket.userId] = socket.id;
    console.log('Active users:', Object.keys(userConnections).length);

    // Notify others that user is online
    socket.broadcast.emit('user_online', { userId: socket.userId });

    // Handle joining conversation room
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`👥 User ${socket.userId} joined conversation ${conversationId}`);
      console.log(`   Room members count: ${io.sockets.adapter.rooms.get(conversationId)?.size || 0}`);
    });

    // Handle leaving conversation room
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`👤 User ${socket.userId} left conversation ${conversationId}`);
    });

    // Handle new message
    socket.on('send_message', async (data) => {
      try {
        console.log(`💬 Message received from ${socket.userId}:`, data);
        const { conversationId, text } = data;

        if (!text || !conversationId) {
          console.error('❌ Missing required fields:', { conversationId, text });
          socket.emit('error', { message: 'conversationId and text are required' });
          return;
        }

        // Check if conversation exists and user is a participant
        const conversation = await Conversation.findById(conversationId);

        if (!conversation) {
          console.error('❌ Conversation not found:', conversationId);
          socket.emit('error', { message: 'Conversation not found' });
          return;
        }

        if (!conversation.participants.includes(socket.userId)) {
          console.error('❌ User not authorized for conversation:', { userId: socket.userId, conversationId });
          socket.emit('error', { message: 'Not authorized to send message in this conversation' });
          return;
        }

        // Create and save message
        const message = await Message.create({
          conversationId,
          senderId: socket.userId,
          text,
        });

        // Populate sender data
        await message.populate('senderId', 'name avatar');

        // Update last message in conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: message._id,
          updatedAt: new Date()
        });

        console.log(`✅ Broadcasting message to room ${conversationId}:`, message._id);
        
        // Emit message to all users in the conversation room
        io.to(conversationId).emit('receive_message', {
          _id: message._id,
          conversationId: message.conversationId,
          senderId: message.senderId,
          text: message.text,
          createdAt: message.createdAt,
          seen: message.seen,
        });

        // Emit updated conversation list to both participants
        const participants = conversation.participants;
        for (const participantId of participants) {
          if (userConnections[participantId]) {
            io.to(userConnections[participantId]).emit('conversation_updated', {
              conversationId,
              lastMessage: message,
              updatedAt: new Date()
            });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('user_typing', (data) => {
      const { conversationId, isTyping } = data;
      socket.to(conversationId).emit('user_typing', {
        userId: socket.userId,
        isTyping
      });
    });

    // Handle message seen
    socket.on('mark_as_seen', async (data) => {
      try {
        const { messageId, conversationId } = data;
        
        await Message.findByIdAndUpdate(messageId, { seen: true });
        
        io.to(conversationId).emit('message_seen', { messageId });
      } catch (error) {
        console.error('Error marking message as seen:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User ${socket.userId} disconnected (${socket.id})`);
      
      delete userConnections[socket.userId];
      console.log('Active users:', Object.keys(userConnections).length);
      
      // Notify others that user is offline
      socket.broadcast.emit('user_offline', { userId: socket.userId });
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });
};

// Helper function to get user's socket ID
export const getUserSocketId = (userId) => {
  return userConnections[userId];
};

// Helper function to get all online users
export const getOnlineUsers = () => {
  return Object.keys(userConnections);
};
