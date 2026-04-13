import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";
import { initSocket } from "../utils/socket";

const ChatWindow = () => {
  const { chatId } = useParams();
  const { 
    currentMessages, 
    loading, 
    error, 
    fetchMessages, 
    sendMessage,
    typingUsers,
    startTyping,
    stopTyping,
    leaveCurrentConversation,
    markAsSeen
  } = useChatStore();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const token = useAuthStore((s) => s.accessToken);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  const messagesEndRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    if (token) {
      initSocket(token);
    }
  }, [token]);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (chatId) {
      fetchMessages(chatId);
    }

    return () => {
      leaveCurrentConversation();
    };
  }, [chatId, fetchMessages, leaveCurrentConversation]);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Mark last message as seen if it's from the other user
    if (currentMessages.length > 0) {
      const lastMessage = currentMessages[currentMessages.length - 1];
      if (lastMessage.senderId._id !== currentUserId && !lastMessage.seen) {
        markAsSeen(lastMessage._id, chatId);
      }
    }
  }, [currentMessages, currentUserId, chatId, markAsSeen]);

  const handleSend = () => {
    if (!newMessage.trim() || !chatId) return;

    try {
      sendMessage(chatId, newMessage.trim());
      setNewMessage("");
      stopTyping(chatId);
      setIsTyping(false);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // Emit typing indicator
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      startTyping(chatId);
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after user stops for 1 second
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(chatId);
    }, 1000);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Find the other participant for the header
  const conversation = useChatStore((s) => s.conversations.find(c => c._id === chatId));
  const otherParticipant = conversation?.participants?.find(p => p._id !== currentUserId);

  if (loading) return <div className="flex h-full items-center justify-center">Loading messages...</div>;
  if (error) return <div className="flex h-full items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">

      {/* 🔹 Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        {otherParticipant?.profilePic ? (
           <img
          src={otherParticipant?.profilePic}
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        ):(
          <div className="w-9 h-9 rounded-full bg-emerald-200
                        flex items-center justify-center
                        text-emerald-700 font-semibold">
          {otherParticipant?.username?.charAt(0).toUpperCase() || "U"}
        </div>


        )}
        <div>
          <h2 className="font-semibold text-gray-800">
            {otherParticipant?.username || "Unknown User"}
          </h2>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>

      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {currentMessages.map((msg) => {
          const isMe = msg.senderId._id === currentUserId;
          return (
            <div
              key={msg._id}
              className={`mb-2 flex ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                  isMe
                    ? "bg-green-500 text-white"
                    : "bg-white text-gray-800"
                }`}
              >
                {msg.text}
                {isMe && msg.seen && (
                  <span className="text-xs ml-1">✓✓</span>
                )}
              </div>
            </div>
          );
        })}

        {/* Typing Indicator */}
        {Object.entries(typingUsers).some(([userId, isUserTyping]) => 
          userId !== currentUserId && isUserTyping
        ) && (
          <div className="mb-2 flex items-center gap-2 text-gray-500 text-sm">
            <span>{otherParticipant?.username} is typing</span>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 🔹 Input */}
      <div className="flex items-center gap-2 border-t bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          value={newMessage}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="rounded-full bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
