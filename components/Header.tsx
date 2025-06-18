'use client';

import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { useTheme } from '@/hooks/useTheme';
import { FaMoon, FaSun } from 'react-icons/fa';

interface HeaderProps {
  onClear: () => void;
  onExport: () => void;
  userEmail: string;
}

const Header: React.FC<HeaderProps> = ({ onClear, onExport, userEmail }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const userInitial = userEmail.charAt(0).toUpperCase();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="bg-gray-100 dark:bg-gray-800 px-6 py-4 shadow-md flex justify-between items-center">
      {/* Left - Title */}
      <div className="text-lg font-semibold text-gray-800 dark:text-white">Chat Bot</div>

      {/* Center - Email */}
      <div className="hidden sm:block text-sm text-gray-600 dark:text-gray-300">
        Hello, {userEmail}
      </div>

      {/* Right - Dropdown */}
      <div className="relative">
        <div
          className="bg-blue-600 text-white w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium cursor-pointer"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          {userInitial}
        </div>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-50">
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-white"
            >
              Toggle Theme
            </button>
            <button
              onClick={() => {
                onClear();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-yellow-600 dark:text-yellow-400"
            >
              Clear Chat
            </button>
            <button
              onClick={() => {
                onExport();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-blue-600 dark:text-blue-400"
            >
              Export Chat
            </button>
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-600 text-red-600 dark:text-red-400"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
