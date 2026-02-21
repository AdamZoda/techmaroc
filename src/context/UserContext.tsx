import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Order } from '../types';
import { mockBackend } from '../services/mockBackend';

interface UserContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  saveOrder: (order: Order) => void;
  getOrders: () => Order[];
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for logged in user session
    const storedUserId = localStorage.getItem('currentUserId');
    if (storedUserId) {
      const users = mockBackend.getUsers();
      const found = users.find(u => u.id === storedUserId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // Simple mock login
    const users = mockBackend.getUsers();
    const found = users.find(u => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('currentUserId', found.id);
    } else {
      // Create new user if not exists (for demo)
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: 'user',
        status: 'active',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
      };
      // In a real app we would call backend to create user
      // For now we just set it in state, but mockBackend doesn't have createUser exposed publicly in this context easily without reloading
      // Let's just use the mockBackend.getUsers() again to be safe if we added it
      // Actually, let's just assume for this demo we log in as 'u2' if email matches, else 'u1'
      
      // Better: Just set the user state directly for the demo
      setUser(newUser);
      localStorage.setItem('currentUserId', newUser.id);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUserId');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      mockBackend.updateUser(updatedUser);
    }
  };

  const saveOrder = (order: Order) => {
    if (!user) return;
    const key = `orders_${user.id}`;
    const currentOrders = JSON.parse(localStorage.getItem(key) || '[]');
    const newOrders = [order, ...currentOrders];
    localStorage.setItem(key, JSON.stringify(newOrders));
  };

  const getOrders = (): Order[] => {
    if (!user) return [];
    const key = `orders_${user.id}`;
    return JSON.parse(localStorage.getItem(key) || '[]');
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateProfile, isAuthenticated: !!user, saveOrder, getOrders, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
