const ChatList = () => {
    return (
      <div className="h-full flex flex-col">
  
        {/* Search */}
        <div className="p-4 border-b border-emerald-100">
          <input
            placeholder="Search chats..."
            className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
  
        {/* Chats */}
        <div className="flex-1 overflow-y-auto">
          {[1,2,3,4].map(i => (
            <div
              key={i}
              className="px-4 py-3 cursor-pointer hover:bg-emerald-50"
            >
              <p className="font-medium text-gray-800">User {i}</p>
              <p className="text-sm text-gray-500 truncate">
                Last message preview...
              </p>
            </div>
          ))}
        </div>
  
      </div>
    );
  };
  
  export default ChatList;
  