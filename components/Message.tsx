import React from 'react';

interface MessageProps {
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const Message: React.FC<MessageProps> = ({ text, sender, timestamp }) => {
  const isUser = sender === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className="flex flex-col items-start gap-1">
        <div
          className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg text-sm ${
            isUser ? 'bg-blue-500 text-black' : 'bg-gray-200 dark:bg-gray-700 text-black'
          }`}
        >
          {text}
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
};

export default Message;
