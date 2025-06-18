'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => setIsMounted(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isMounted) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const user = await login(email.trim(), password);
      if (isMounted) {
        router.push('/dashboard');
      }
    } catch (error: any) {
      if (isMounted) {
        setErrorMsg(error.message || 'An unexpected error occurred.');
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>

        {errorMsg && <p className="text-red-600 mb-4 text-sm text-center">{errorMsg}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-3"
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded mb-4"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p className="mt-4 text-sm">
          Don’t have an account?{' '}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </form>
    </div>
  );
}
