import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";

const Chat = () => {
  return (
    <div className="h-[calc(100vh-3rem)] bg-white rounded-2xl border border-emerald-100 flex overflow-hidden">

      {/* Left */}
      <div className="w-80 border-r border-emerald-100">
        <ChatList />
      </div>

      {/* Right */}
      <div className="flex-1">
        <ChatWindow />
      </div>

    </div>
  );
};

export default Chat;
