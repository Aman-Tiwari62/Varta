import { useState, useRef, useEffect } from "react";

const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey 👋", sender: "other" },
    { id: 2, text: "Hi! How are you?", sender: "me" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: newMessage,
        sender: "me",
      },
    ]);

    setNewMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full w-full flex-col bg-gray-100">

      {/* 🔹 Header */}
      <div className="flex items-center gap-3 border-b bg-white px-4 py-3">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          className="h-10 w-10 rounded-full"
        />
        <div>
          <h2 className="font-semibold text-gray-800">John Doe</h2>
          <p className="text-xs text-gray-500">online</p>
        </div>
      </div>

      {/* 🔹 Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${
              msg.sender === "me" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.sender === "me"
                  ? "bg-green-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* 🔹 Input */}
      <div className="flex items-center gap-2 border-t bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Type a message"
          className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
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
