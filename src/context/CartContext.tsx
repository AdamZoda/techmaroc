import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { useUser } from './UserContext';

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  updateQuantity: (productId: string, quantity: number) => void;
  total: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCartLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isUserLoading } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isCartLoading, setIsCartLoading] = useState(true);

  // Load cart when user changes
  useEffect(() => {
    if (isUserLoading) return;

    const key = user ? `cart_${user.id}` : 'cart_guest';
    const stored = localStorage.getItem(key);
    
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems([]);
    }
    setIsCartLoading(false);
  }, [user, isUserLoading]);

  // Save cart when items change
  useEffect(() => {
    if (isUserLoading || isCartLoading) return;
    
    const key = user ? `cart_${user.id}` : 'cart_guest';
    localStorage.setItem(key, JSON.stringify(items));
  }, [items, user, isUserLoading, isCartLoading]);

  const addToCart = (product: Product) => {
    setItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setItems(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart, updateQuantity, total, isOpen, setIsOpen, isCartLoading }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
