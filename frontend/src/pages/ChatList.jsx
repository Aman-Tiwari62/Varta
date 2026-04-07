// const ChatList = () => {
//     return (
//       <div className="h-full flex flex-col">
  
//         {/* Search */}
//         <div className="p-4 border-b border-emerald-100">
//           <input
//             placeholder="Search chats..."
//             className="w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500"
//           />
//         </div>
  
//         {/* Chats */}
//         <div className="flex-1 overflow-y-auto">
//           {[1,2,3,4].map(i => (
//             <div
//               key={i}
//               className="px-4 py-3 cursor-pointer hover:bg-emerald-50"
//             >
//               <p className="font-medium text-gray-800">User {i}</p>
//               <p className="text-sm text-gray-500 truncate">
//                 Last message preview...
//               </p>
//             </div>
//           ))}
//         </div>
  
//       </div>
//     );
//   };
  
//   export default ChatList;
  
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";

const ChatList = () => {
  const { conversations, loading, error, fetchConversations } = useChatStore();
  const currentUserId = useAuthStore((s) => s.user?._id);
  const { chatId } = useParams();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  if (loading) return <div className="p-4">Loading chats...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;

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
        {conversations.map((conversation) => {
          const otherParticipant = (conversation.participants || []).find(
            (participant) => participant._id !== currentUserId
          );

          return (
            <Link
              key={conversation._id}
              to={`/user/chat/${conversation._id}`}
              className={`px-4 py-3 cursor-pointer hover:bg-emerald-50 block ${
                chatId === conversation._id ? 'bg-emerald-100' : ''
              }`}
            >
              <p className="font-medium text-gray-800">
                {otherParticipant?.username || 'Unknown User'}
              </p>
              <p className="text-sm text-gray-500 truncate">
                {conversation.lastMessage?.text || 'No messages yet'}
              </p>
            </Link>
          );
        })}
        
        {conversations.length === 0 && (
          <div className="p-4 text-gray-500 text-center">
            No conversations yet
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;