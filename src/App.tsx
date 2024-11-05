import React, { useState, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Sidebar } from './components/Sidebar';
import { Chat, Message } from './types';
import { getAIResponse } from './lib/ai';

function App() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChat = chats.find((chat) => chat.id === activeChat);

  const createNewChat = () => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      timestamp: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChat(newChat.id);
  };

  useEffect(() => {
    if (chats.length === 0) {
      createNewChat();
    }
  }, []);

  const sendMessage = async (content: string) => {
    if (!activeChat) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: Date.now(),
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [...chat.messages, userMessage],
              title: chat.messages.length === 0 ? content.slice(0, 30) + '...' : chat.title,
            }
          : chat
      )
    );

    setLoading(true);
    setError(null);

    try {
      const response = await getAIResponse(content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: Date.now(),
      };

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, assistantMessage],
              }
            : chat
        )
      );
    } catch (error) {
      setError('Failed to get AI response. Please try again.');
      console.error('Failed to get AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-white">
      <Sidebar
        chats={filteredChats}
        activeChat={activeChat}
        onNewChat={createNewChat}
        onSelectChat={setActiveChat}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {currentChat?.messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {error && (
            <div className="p-4 mx-auto max-w-3xl">
              <div className="bg-red-50 text-red-700 p-4 rounded-md">
                {error}
              </div>
            </div>
          )}
        </div>
        <div className="border-t">
          <ChatInput onSend={sendMessage} disabled={loading} />
        </div>
      </main>
    </div>
  );
}

export default App;