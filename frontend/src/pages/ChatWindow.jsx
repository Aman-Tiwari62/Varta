const ChatWindow = () => {
    return (
      <div className="h-full flex flex-col">
  
        {/* Header */}
        <div className="px-6 py-4 border-b border-emerald-100">
          <h2 className="font-semibold text-gray-800">
            Select a chat
          </h2>
        </div>
  
        {/* Messages */}
        <div className="flex-1 p-6 text-gray-400">
          No messages yet
        </div>
  
        {/* Input */}
        <div className="p-4 border-t border-emerald-100">
          <input
            placeholder="Type a message..."
            className="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
  
      </div>
    );
  };
  
  export default ChatWindow;
  