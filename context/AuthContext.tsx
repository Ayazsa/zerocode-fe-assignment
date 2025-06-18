'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signup as fbSignup, login as fbLogin, logout as fbLogout } from '@/lib/firebaseAuth';

interface AuthContextType {
  user: User | null;
  signup: (email: string, password: string) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signup: AuthContextType['signup'] = async (email, password) => {
    try {
      const user = await fbSignup(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const user = await fbLogin(email, password);
      setUser(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout: AuthContextType['logout'] = async () => {
    await fbLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
