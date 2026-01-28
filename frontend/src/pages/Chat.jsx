import { Routes, Route } from "react-router-dom";
import ChatList from "./ChatList";
import SelectChat from "./SelectChat";
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
        <Routes>
          {/* /chat */}
          <Route index element={<SelectChat />} />

          {/* /chat/:chatId */}
          <Route path=":chatId" element={<ChatWindow />} />
        </Routes>
      </div>

    </div>
  );
};

export default Chat;

