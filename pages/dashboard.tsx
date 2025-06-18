'use client';

import React, { useEffect, useRef, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import Message from '@/components/Message';

interface MessageType {
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

const LOCAL_STORAGE_KEY = 'chat_messages';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user?.email) {
        setUserEmail(user.email);
      } else {
        router.push('/login');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    const newUserMessage: MessageType = {
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    // Dummy reply for 'hello'
    if (text.trim().toLowerCase() === 'hello') {
      const botReply: MessageType = {
        sender: 'bot',
        text: `Hello, ${userEmail}!`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, botReply]);
        setLoading(false);
      }, 1000); // simulate bot typing delay
      return;
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      setTimeout(() => {
        const botReply: MessageType = {
          sender: 'bot',
          text: data?.reply?.trim() || "I'm just a bot, but I'll try to help!",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, botReply]);
        setLoading(false);
      }, 2000);
    } catch (error) {
      console.error('Error sending message:', error);
      setTimeout(() => {
        const fallbackReply: MessageType = {
          sender: 'bot',
          text: "I'm just a bot, but I'll try to help!",
          timestamp: new Date().toLocaleTimeString(),
        };
        setMessages((prev) => [...prev, fallbackReply]);
        setLoading(false);
      }, 2000);
    }
  };

  const handleClear = () => {
    setShowConfirmModal(true);
  };

  const confirmClear = () => {
    setMessages([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setShowConfirmModal(false);
  };

  const cancelClear = () => {
    setShowConfirmModal(false);
  };

  const handleExport = () => {
    if (!messages.length) {
      alert('No chat history to export.');
      return;
    }

    const content = messages
      .map((msg) => `[${msg.timestamp}] ${msg.sender.toUpperCase()}: ${msg.text}`)
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString()}.txt`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <Header onClear={handleClear} onExport={handleExport} userEmail={userEmail} />

      <div className="flex-1 overflow-y-auto px-4 py-6 mb-20 sm:mb-24">
        <div className="space-y-4 sm:max-w-full md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          {messages.length === 0 && !loading ? (
            <div className="text-center text-gray-500 dark:text-gray-400 mt-10">Start Chat...</div>
          ) : (
            messages.map((msg, index) => (
              <Message key={index} sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
            ))
          )}

          {loading && (
            <div className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
              Bot is typing...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <ChatInput onSend={sendMessage} disabled={loading} />

      {/* Custom confirmation modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">Clear Chat</h2>
            <p className="mb-6">Are you sure you want to clear the entire chat?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={cancelClear}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={confirmClear}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
