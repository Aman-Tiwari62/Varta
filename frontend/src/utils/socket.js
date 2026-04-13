import io from 'socket.io-client';

let socket = null;

// Initialize socket connection
export const initSocket = (token) => {
  if (socket?.connected) {
    console.log('Socket already connected');
    return socket;
  }

  console.log('Initializing socket with token:', token ? 'present' : 'missing');

  socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
    auth: {
      token: `Bearer ${token}`,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected:', socket.id);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Socket connection error:', error);
  });

  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });

  return socket;
};

// Get the socket instance
export const getSocket = () => {
  return socket;
};

// Disconnect socket
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Join a conversation room
export const joinConversation = (conversationId) => {
  if (socket) {
    socket.emit('join_conversation', conversationId);
  }
};

// Leave a conversation room
export const leaveConversation = (conversationId) => {
  if (socket) {
    socket.emit('leave_conversation', conversationId);
  }
};

// Send a message
export const sendMessage = (conversationId, text) => {
  if (socket) {
    socket.emit('send_message', {
      conversationId,
      text,
    });
  }
};

// Listen for incoming messages
export const onReceiveMessage = (callback) => {
  if (socket) {
    socket.on('receive_message', callback);
  }
};

// Remove message listener
export const offReceiveMessage = (callback) => {
  if (socket) {
    socket.off('receive_message', callback);
  }
};

// Listen for typing indicator
export const onUserTyping = (callback) => {
  if (socket) {
    socket.on('user_typing', callback);
  }
};

// Remove typing listener
export const offUserTyping = (callback) => {
  if (socket) {
    socket.off('user_typing', callback);
  }
};

// Emit typing indicator
export const emitUserTyping = (conversationId, isTyping) => {
  if (socket) {
    socket.emit('user_typing', {
      conversationId,
      isTyping,
    });
  }
};

// Listen for user online
export const onUserOnline = (callback) => {
  if (socket) {
    socket.on('user_online', callback);
  }
};

// Listen for user offline
export const onUserOffline = (callback) => {
  if (socket) {
    socket.on('user_offline', callback);
  }
};

// Listen for conversation updates
export const onConversationUpdated = (callback) => {
  if (socket) {
    socket.on('conversation_updated', callback);
  }
};

// Mark message as seen
export const markMessageAsSeen = (messageId, conversationId) => {
  if (socket) {
    socket.emit('mark_as_seen', {
      messageId,
      conversationId,
    });
  }
};

// Listen for message seen
export const onMessageSeen = (callback) => {
  if (socket) {
    socket.on('message_seen', callback);
  }
};
