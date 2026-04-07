import { create } from "zustand";
import { fetchWithAuth } from "../utils/fetchWithAuth";

const useChatStore = create((set, get) => ({
  conversations: [],
  currentMessages: [],
  loading: false,
  error: null,

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

  fetchMessages: async (conversationId) => {
    set({ loading: true, error: null });
    try {
      const response = await fetchWithAuth({
        url: `/chat/messages/${conversationId}`,
        options: { method: "GET" }
      });

      if (!response.ok) throw new Error("Failed to fetch messages");

      const data = await response.json();
      set({ currentMessages: data.messages });
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (conversationId, text) => {
    try {
      const response = await fetchWithAuth({
        url: "/chat/messages",
        options: {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId, text })
        }
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      // Add the new message to current messages
      set(state => ({
        currentMessages: [...state.currentMessages, data.message]
      }));

      // Update the last message in conversations list
      get().updateLastMessage(conversationId, data.message);

      return data.message;
    } catch (error) {
      set({ error: error.message });
      throw error;
    }
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
  }
}));

export default useChatStore;