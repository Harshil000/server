import React from "react";
import {
  Plus,
  MessageSquare,
  Trash2,
  Compass,
  Library,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles
} from "lucide-react";

const Sidebar = ({
  chats = {},
  currentChatID,
  onSelectChat,
  onNewThread,
  onDeleteChat,
  user,
  onLogout,
  isOpen,
  toggleSidebar
}) => {
  const chatEntries = Object.entries(chats);

  return (
    <aside
      className={`fixed md:static inset-y-0 left-0 z-40 flex flex-col bg-[#18191A] text-[#9B9C9E] border-r border-[#262729] transition-all duration-300 ${
        isOpen ? "w-64" : "w-16 md:w-16"
      }`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-[#262729]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-[#00AD9F] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {isOpen && (
            <span className="font-semibold text-white tracking-wide text-lg truncate">
              perplexity
            </span>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1.5 hover:bg-[#262729] text-[#9B9C9E] hover:text-white rounded-md transition-colors"
          title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeftOpen className="w-5 h-5" />}
        </button>
      </div>

      {/* New Thread Action */}
      <div className="p-3">
        <button
          onClick={onNewThread}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-[#303236] bg-[#202225] hover:bg-[#2A2C30] hover:border-[#00AD9F]/40 text-white font-medium text-sm transition-all shadow-sm ${
            !isOpen && "justify-center px-0"
          }`}
        >
          <Plus className="w-5 h-5 text-[#00AD9F] shrink-0" />
          {isOpen && <span>New Thread</span>}
        </button>
      </div>



      {/* Recent Threads List */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 scrollbar-thin scrollbar-thumb-zinc-800">
        {isOpen && (
          <div className="px-3 py-1 text-xs font-semibold text-[#68696C] uppercase tracking-wider">
            Threads
          </div>
        )}
        {chatEntries.length === 0 ? (
          isOpen && (
            <div className="px-3 py-4 text-xs text-[#68696C] text-center italic">
              No recent threads yet
            </div>
          )
        ) : (
          chatEntries.map(([title, chatData]) => {
            const isActive = currentChatID && chatData.chatID === currentChatID;
            return (
              <div
                key={chatData.chatID || title}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isActive
                    ? "bg-[#25282A] text-white font-medium border-l-2 border-[#00AD9F]"
                    : "hover:bg-[#222426] text-[#A0A1A4] hover:text-white"
                } ${!isOpen && "justify-center px-0"}`}
                onClick={() => onSelectChat(chatData.chatID, title)}
                title={title}
              >
                <div className="flex items-center gap-2.5 truncate min-w-0 pr-1">
                  <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? "text-[#00AD9F]" : "text-[#68696C]"}`} />
                  {isOpen && <span className="truncate">{title}</span>}
                </div>

                {isOpen && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteChat(chatData.chatID || title);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#33363A] text-[#808184] hover:text-red-400 rounded transition-all"
                    title="Delete thread"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-[#262729] bg-[#151617]">
        <div className={`flex items-center ${isOpen ? "justify-between" : "justify-center"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-600 to-cyan-700 flex items-center justify-center text-white font-bold text-xs shrink-0 uppercase shadow">
              {user?.username ? user.username[0] : <User className="w-4 h-4" />}
            </div>
            {isOpen && (
              <div className="flex flex-col truncate">
                <span className="text-sm font-medium text-white truncate">
                  {user?.username || "Guest User"}
                </span>
                <span className="text-[11px] text-[#68696C] truncate">
                  {user?.email || "Pro Plan"}
                </span>
              </div>
            )}
          </div>
          {isOpen && onLogout && (
            <button
              onClick={onLogout}
              className="p-1.5 hover:bg-[#262729] text-[#808184] hover:text-white rounded-md transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
