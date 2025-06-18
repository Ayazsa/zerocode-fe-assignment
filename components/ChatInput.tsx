'use client';

import React, { useState, useRef } from 'react';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setHistory((prev) => [...prev, trimmed]);
      setInputValue('');
      setHistoryIndex(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        const newIndex = prev === null ? history.length - 1 : Math.max(prev - 1, 0);
        setInputValue(history[newIndex]);
        return newIndex;
      });
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0) return;
      setHistoryIndex((prev) => {
        if (prev === null) return null;
        const newIndex = Math.min(prev + 1, history.length - 1);
        setInputValue(history[newIndex]);
        return newIndex;
      });
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition: any = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue((prev) => prev + ' ' + transcript);
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-gray-50 dark:bg-gray-800 border-t dark:border-gray-700 px-2 py-3">
      <div
        className="w-full mx-auto flex items-center space-x-2 
          sm:max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <input
          type="text"
          placeholder={disabled ? 'Bot is typing...' : 'Type a message...'}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setHistoryIndex(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={`flex-grow px-4 py-2 rounded-md outline-none text-gray-900 dark:text-white text-sm
            ${disabled ? 'bg-gray-200 dark:bg-gray-600 cursor-not-allowed' : 'bg-gray-100 dark:bg-gray-700'}
          `}
        />

        <button
          type="button"
          onClick={startListening}
          disabled={disabled}
          title="Voice input"
          className={`p-2 rounded-full transition ${
            listening
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-gray-300 dark:bg-gray-600 text-black dark:text-white'
          }`}
        >
          {listening ? <FaMicrophoneSlash /> : <FaMicrophone />}
        </button>

        <button
          onClick={handleSend}
          disabled={!inputValue.trim() || disabled}
          className={`px-4 py-2 rounded-md font-medium text-sm transition whitespace-nowrap ${
            !inputValue.trim() || disabled
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
