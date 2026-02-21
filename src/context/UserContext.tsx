import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Order } from '../types';
import { supabase } from '../lib/supabase';
import { getOrdersByUser, updateProfile as updateProfileDB } from '../services/supabaseService';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ error: string | null }>;
  register: (email: string, password: string, name: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  saveOrder: (order: Order) => Promise<void>;
  getOrders: () => Promise<Order[]>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = useCallback(async (userId: string, email: string) => {
    console.log('👤 Fetching Profile for:', userId);

    // 5 second timeout for profile fetch specifically
    const profileTimeout = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
    );

    try {
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, profileTimeout]);

      if (error || !data) {
        // Fallback to minimal user object
        const minimal: User = {
          id: userId,
          name: email.split('@')[0],
          email,
          role: 'user',
          status: 'active',
          avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=7c3aed&color=fff`,
        };
        setUser(minimal);
        return;
      }

      setUser({
        id: data.id,
        name: data.full_name || email.split('@')[0],
        email: data.email || email,
        role: data.role as User['role'],
        status: (data.status as User['status']) || 'active',
        phone: data.phone ?? undefined,
        avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.full_name || email)}&background=7c3aed&color=fff`,
      });
    } catch (err: any) {
      console.error('💥 Profile fetch failed:', err.message || err);
      // Ensure we don't leave the user null if they are signed in
      setUser({
        id: userId,
        name: email.split('@')[0],
        email,
        role: 'user',
        status: 'active',
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=7c3aed&color=fff`,
      });
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Safety timeout — if Supabase doesn't respond in 5s, unblock the UI
    const timeout = setTimeout(() => {
      if (mounted) setIsLoading(false);
    }, 5000);

    // onAuthStateChange fires INITIAL_SESSION on mount in Supabase v2
    // We make this non-blocking to prevent signInWithPassword from hanging
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted) return;

      const finishLoading = () => {
        if (mounted) {
          clearTimeout(timeout);
          setIsLoading(false);
        }
      };

      if (session?.user) {
        // Start profile fetch but don't wait for it to return the listener
        fetchProfile(session.user.id, session.user.email || '').finally(finishLoading);
      } else {
        setUser(null);
        finishLoading();
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const login = async (email: string, password: string): Promise<{ error: string | null }> => {
    // 10 second timeout for the auth call
    const timeout = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error('Le délai d\'attente est dépassé (Timeout)')), 10000)
    );

    try {
      const authPromise = supabase.auth.signInWithPassword({ email, password });
      const { data, error } = await Promise.race([authPromise, timeout]);

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      console.error('💥 Login Exception:', err.message || err);
      return { error: err.message || 'Erreur de connexion' };
    }
  };

  const register = async (email: string, password: string, name: string): Promise<{ error: string | null }> => {
    // 10 second timeout for the auth call
    const timeout = new Promise<any>((_, reject) =>
      setTimeout(() => reject(new Error('Le délai d\'attente est dépassé (Timeout)')), 10000)
    );

    try {
      const authPromise = supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });
      const { data, error } = await Promise.race([authPromise, timeout]);

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch (err: any) {
      console.error('💥 Registration Exception:', err.message || err);
      return { error: err.message || 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!user) return;
    const dbUpdates: { full_name?: string; phone?: string; avatar_url?: string } = {};
    if (updates.name) dbUpdates.full_name = updates.name;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.avatar) dbUpdates.avatar_url = updates.avatar;

    await updateProfileDB(user.id, dbUpdates);
    setUser({ ...user, ...updates });
  };

  const saveOrder = async (_order: Order) => {
    // Orders are saved directly in CheckoutPage via supabaseService.createOrder
    // This stub exists for interface compatibility
  };

  const getOrders = async (): Promise<Order[]> => {
    if (!user) return [];
    return getOrdersByUser(user.id);
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin';

  return (
    <UserContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin,
      saveOrder,
      getOrders,
      isLoading,
    }}>
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
