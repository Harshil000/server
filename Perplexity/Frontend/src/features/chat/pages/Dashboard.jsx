import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import useChat from "../hooks/useChat";
import Sidebar from "../components/Sidebar";
import ChatInput from "../components/ChatInput";
import NewThreadHero from "../components/NewThreadHero";
import ThreadView from "../components/ThreadView";

const Dashboard = () => {
  const { chatID: urlChatID } = useParams();
  const navigate = useNavigate();
  const chat = useChat();
  const user = useSelector((state) => state.auth.user);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    chat.getAllChatsHandler();
  }, []);

  useEffect(() => {
    if (urlChatID) {
      chat.setCurrentChatID(urlChatID);
      const existingChat = Object.values(chat.chats || {}).find(
        (c) => c.chatID === urlChatID
      );
      if (!existingChat || !existingChat.messages || existingChat.messages.length === 0) {
        chat.getMessagesHandler(urlChatID);
      }
    } else {
      chat.setCurrentChatID(null);
    }
  }, [urlChatID]);

  const handleSelectChat = (chatID) => {
    navigate(`/${chatID}`);
  };

  const handleNewThread = () => {
    chat.setCurrentChatID(null);
    navigate("/");
  };

  const handleDeleteChat = (chatID) => {
    chat.deleteChatHandler(chatID);
    if (urlChatID === chatID) {
      navigate("/");
    }
  };

  const handleSendMessage = async (messageText, files = []) => {
    const activeID = urlChatID || chat.currentChatID;
    const result = await chat.sendMessageHandler(messageText, activeID, files);
    if (result && result.chatID && result.chatID !== urlChatID) {
      navigate(`/${result.chatID}`);
    }
  };

  // Find active chat data by currentChatID
  const activeChatEntry = Object.entries(chat.chats || {}).find(
    ([_, data]) => data.chatID === chat.currentChatID
  );

  const activeTitle = activeChatEntry ? activeChatEntry[0] : "";
  const activeMessages = activeChatEntry ? activeChatEntry[1].messages : [];

  const isThreadActive = Boolean(chat.currentChatID && (activeMessages.length > 0 || chat.loading));

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#141516] text-[#E0E1E4] font-sans antialiased">
      {/* Sidebar */}
      <Sidebar
        chats={chat.chats}
        currentChatID={chat.currentChatID}
        onSelectChat={handleSelectChat}
        onNewThread={handleNewThread}
        onDeleteChat={handleDeleteChat}
        user={user}
        isOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-gradient-to-b from-[#161718] to-[#111213]">
        {/* Top Bar Navigation on Mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#18191A] border-b border-[#262729]">
          <span className="font-semibold text-white tracking-wide">perplexity</span>
          <button
            onClick={handleNewThread}
            className="text-xs px-3 py-1.5 rounded-lg bg-[#00AD9F] text-black font-semibold"
          >
            New
          </button>
        </header>

        {/* View Mode: Hero or Active Thread */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {isThreadActive ? (
            <ThreadView
              title={activeTitle}
              messages={activeMessages}
              loading={chat.loading}
            />
          ) : (
            <NewThreadHero onSelectPrompt={handleSendMessage} />
          )}
        </div>

        {/* Bottom Floating Prompt Input */}
        <div className="w-full bg-gradient-to-t from-[#141516] via-[#141516]/90 to-transparent">
          <ChatInput
            onSend={handleSendMessage}
            loading={chat.loading}
            placeholder={
              isThreadActive
                ? "Ask follow-up..."
                : "Ask anything..."
            }
          />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;