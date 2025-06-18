import React, { useEffect, useRef } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

interface MessageType {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

interface ChatContainerProps {
  messages: MessageType[];
  onSend: (text: string) => void;
  isTyping: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onSend, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border rounded-lg shadow-sm overflow-hidden">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-2 sm:px-4 py-4">
        <div className="max-w-xl w-full mx-auto space-y-2">
          {messages.map((msg, idx) => (
            <Message key={idx} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
          ))}
          {isTyping && (
            <div className="text-sm text-gray-500 dark:text-gray-400 pl-2">Bot is typing...</div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="border-t px-2 sm:px-4 py-3 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-xl w-full mx-auto flex items-center gap-2">
          <ChatInput onSend={onSend} disabled={isTyping} />
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
