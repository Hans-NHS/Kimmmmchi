// src/pages/ChatInterface.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Plus, MessagesSquare } from 'lucide-react';

export default function ChatInterface() {
  // Manage multiple chat sessions
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    return saved ? JSON.parse(saved) : [{
      id: 'default',
      title: 'New Chat',
      messages: [{
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your course assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]
    }];
  });
  
  const [currentChatId, setCurrentChatId] = useState('default');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chats));
  }, [chats]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your course assistant. How can I help you today?",
        timestamp: new Date().toISOString()
      }]
    };
    setChats(prev => [...prev, newChat]);
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(chats[0]?.id || 'default');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    // Update the current chat with the new message
    setChats(prev => prev.map(chat => 
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, userMessage] }
        : chat
    ));
    
    setInputMessage('');
    setIsLoading(true);

    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const botResponse = {
        id: Date.now() + 1,
        type: 'assistant',
        content: "I'm a demo chatbot. The actual AI integration will be implemented later.",
        timestamp: new Date().toISOString()
      };
      
      setChats(prev => prev.map(chat => 
        chat.id === currentChatId
          ? { ...chat, messages: [...chat.messages, botResponse] }
          : chat
      ));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentChat = () => chats.find(chat => chat.id === currentChatId) || chats[0];

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-900 transition-all duration-300 flex flex-col`}>
        <div className="p-4">
          <button
            onClick={createNewChat}
            className="w-full flex items-center justify-center space-x-2 text-white bg-gray-700 hover:bg-gray-600 rounded-lg p-3 transition-colors"
          >
            <Plus size={16} />
            <span>New Chat</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`group flex items-center space-x-3 p-3 cursor-pointer hover:bg-gray-800 ${
                currentChatId === chat.id ? 'bg-gray-800' : ''
              }`}
              onClick={() => setCurrentChatId(chat.id)}
            >
              <MessagesSquare size={16} className="text-gray-400" />
              <span className="flex-1 text-gray-300 truncate">{chat.title}</span>
              {currentChatId === chat.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {getCurrentChat()?.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'assistant' ? 'bg-gray-50' : ''} p-4`}
            >
              <div className="flex-1 max-w-4xl mx-auto">
                <div className="flex space-x-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center
                    ${message.type === 'assistant' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    <span className="text-white text-sm">
                      {message.type === 'assistant' ? 'A' : 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="prose">{message.content}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send a message..."
                className="w-full rounded-lg border border-gray-200 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-600 disabled:text-gray-300"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
