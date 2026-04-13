import { create } from "zustand";
import { fetchWithAuth } from "../utils/fetchWithAuth";
import {
  sendMessage as socketSendMessage,
  onReceiveMessage,
  offReceiveMessage,
  joinConversation,
  leaveConversation,
  onConversationUpdated,
  onUserTyping,
  offUserTyping,
  emitUserTyping,
  markMessageAsSeen,
  onMessageSeen,
} from "../utils/socket";

const useChatStore = create((set, get) => ({
  conversations: [],
  currentMessages: [],
  loading: false,
  error: null,
  typingUsers: {}, // { userId: true/false }
  currentConversationId: null,

  // Fetch conversations from database (REST API - only initial load)
  fetchConversations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth({
        url: "/chat/conversations",
        options: { method: "GET" }
      });

      if (!response.ok) throw new Error("Failed to fetch conversations");

      const data = await response.json();
      set({ conversations: data.conversations });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Fetch messages from database (REST API - only initial load)
  fetchMessages: async (conversationId) => {
    set({ loading: true, error: null, currentConversationId: conversationId });
    try {
      const response = await fetchWithAuth({
        url: `/chat/messages/${conversationId}`,
        options: { method: "GET" }
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      set({ currentMessages: data.messages });

      // Join socket room for this conversation
      joinConversation(conversationId);

      // Listen for incoming messages on this conversation
      const handleNewMessage = (message) => {
        set(state => ({
          currentMessages: [...state.currentMessages, message]
        }));
      };

      onReceiveMessage(handleNewMessage);

      // Listen for conversation updates
      const handleConversationUpdate = (data) => {
        if (data.conversationId === conversationId) {
          get().updateLastMessage(conversationId, data.lastMessage);
        }
      };

      onConversationUpdated(handleConversationUpdate);

      // Listen for typing indicators
      const handleUserTyping = (data) => {
        set(state => ({
          typingUsers: {
            ...state.typingUsers,
            [data.userId]: data.isTyping
          }
        }));
      };

      onUserTyping(handleUserTyping);

      // Listen for message seen status
      const handleMessageSeen = (data) => {
        set(state => ({
          currentMessages: state.currentMessages.map(msg =>
            msg._id === data.messageId ? { ...msg, seen: true } : msg
          )
        }));
      };

      onMessageSeen(handleMessageSeen);

      // Store cleanup functions in state for later removal
      set(state => ({
        ...state,
        _messageListener: handleNewMessage,
        _conversationListener: handleConversationUpdate,
        _typingListener: handleUserTyping,
        _seenListener: handleMessageSeen
      }));

    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  // Send message via socket
  sendMessage: (conversationId, text) => {
    try {
      socketSendMessage(conversationId, text);
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
  },

  // Stop typing indicator
  stopTyping: (conversationId) => {
    emitUserTyping(conversationId, false);
  },

  // Start typing indicator
  startTyping: (conversationId) => {
    emitUserTyping(conversationId, true);
  },

  // Mark message as seen
  markAsSeen: (messageId, conversationId) => {
    markMessageAsSeen(messageId, conversationId);
  },

  // Add conversation when created
  addConversation: (conversation) => {
    set(state => ({
      conversations: [conversation, ...state.conversations]
    }));
  },

  // Update last message in conversation
  updateLastMessage: (conversationId, message) => {
    set(state => ({
      conversations: state.conversations.map(conv =>
        conv._id === conversationId
          ? { ...conv, lastMessage: message }
          : conv
      )
    }));
  },

  // Cleanup when leaving conversation
  leaveCurrentConversation: () => {
    const conversationId = get().currentConversationId;
    
    if (conversationId) {
      // Remove socket listeners
      const state = get();
      if (state._messageListener) {
        offReceiveMessage(state._messageListener);
      }
      if (state._typingListener) {
        offUserTyping(state._typingListener);
      }

      // Leave socket room
      leaveConversation(conversationId);
    }

    set({
      currentConversationId: null,
      typingUsers: {},
      _messageListener: null,
      _conversationListener: null,
      _typingListener: null,
      _seenListener: null
    });
  }
}));

export default useChatStore;