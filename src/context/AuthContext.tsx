'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, SafeUser } from '@/types';

const DEFAULT_USERS: User[] = [
  {id:1, name:'Alex Johnson', email:'user@shopflow.com', password:'user123', role:'user', avatar:'👤', joined:'Jan 2024'},
  {id:2, name:'Admin User', email:'admin@shopflow.com', password:'admin123', role:'admin', avatar:'🛡️', joined:'Oct 2023'}
];

interface AuthContextType {
  currentUser: SafeUser | null;
  users: User[];
  login: (email: string, password: string) => { ok: boolean; error?: string };
  register: (name: string, email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedUsers = localStorage.getItem('shopflow-users-db');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(DEFAULT_USERS);
      localStorage.setItem('shopflow-users-db', JSON.stringify(DEFAULT_USERS));
    }

    const storedUser = localStorage.getItem('shopflow-user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setMounted(true);
  }, []);

  const login = (email: string, password: string) => {
    const user = users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim() && u.password === password);
    if (user) {
      const safeUser = { id: user.id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, joined: user.joined };
      setCurrentUser(safeUser);
      localStorage.setItem('shopflow-user', JSON.stringify(safeUser));
      return { ok: true };
    }
    return { ok: false, error: 'Invalid email or password' };
  };

  const register = (name: string, email: string, password: string) => {
    if (users.find(u => u.email.toLowerCase().trim() === email.toLowerCase().trim())) {
      return { ok: false, error: 'Email already exists' };
    }
    const newUser: User = {
      id: Date.now(),
      name,
      email: email.trim(),
      password,
      role: 'user',
      avatar: '👤',
      joined: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    };
    const newUsers = [...users, newUser];
    setUsers(newUsers);
    localStorage.setItem('shopflow-users-db', JSON.stringify(newUsers));
    
    const safeUser = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role, avatar: newUser.avatar, joined: newUser.joined };
    setCurrentUser(safeUser);
    localStorage.setItem('shopflow-user', JSON.stringify(safeUser));
    return { ok: true };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('shopflow-user');
  };

  const isLoggedIn = !!currentUser;
  const isAdmin = currentUser?.role === 'admin';

  if (!mounted) return null;

  return (
    <AuthContext.Provider value={{ currentUser, users, login, register, logout, isLoggedIn, isAdmin }}>
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
