import React from 'react';
import { PlusCircle, MessageSquare, Search } from 'lucide-react';
import { Chat } from '../types';
import clsx from 'clsx';

interface SidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  return (
    <div className="w-80 bg-gray-900 h-screen flex flex-col">
      <button
        onClick={onNewChat}
        className="flex items-center gap-2 m-2 p-3 rounded-md border border-gray-700 hover:bg-gray-700 text-white transition-colors"
      >
        <PlusCircle className="w-5 h-5" />
        New chat
      </button>

      <div className="px-2 mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={clsx(
              'flex items-center gap-2 w-full p-3 hover:bg-gray-700 text-left text-gray-300',
              activeChat === chat.id && 'bg-gray-700'
            )}
          >
            <MessageSquare className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>
    </div>
  );
}