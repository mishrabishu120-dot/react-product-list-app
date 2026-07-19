'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { CartItem, PromoCode, CartAction, Product } from '@/types';

interface CartState {
  items: CartItem[];
  promo: PromoCode | null;
}

interface CartContextType extends CartState {
  totalCount: number;
  subtotal: number;
  discount: number;
  totalPrice: number;
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  updateQuantity: (id: number, qty: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: PromoCode) => void;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function cartReducer(state: CartState, action: CartAction | { type: 'LOAD'; payload: CartState }): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, qty: Math.max(1, action.qty) } : i)
      };
    case 'CLEAR':
      return { items: [], promo: null };
    case 'APPLY_PROMO':
      return { ...state, promo: action.code };
    case 'REMOVE_PROMO':
      return { ...state, promo: null };
    case 'LOAD':
      return action.payload;
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], promo: null });

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('shopflow-cart');
    if (stored) {
      try {
        dispatch({ type: 'LOAD', payload: JSON.parse(stored) });
      } catch (e) {}
    }
  }, []);

  // Sync to localStorage on changes
  useEffect(() => {
    if (state.items.length > 0 || state.promo !== null) {
      localStorage.setItem('shopflow-cart', JSON.stringify(state));
    } else {
      localStorage.removeItem('shopflow-cart');
    }
  }, [state]);

  const totalCount = state.items.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = state.items.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = state.promo ? subtotal * (state.promo.discount / 100) : 0;
  const totalPrice = subtotal - discount;

  // Helper actions
  const addToCart = (product: Product) => dispatch({ type: 'ADD', product });
  const removeFromCart = (id: number) => dispatch({ type: 'REMOVE', id });
  const updateQty = (id: number, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const updateQuantity = (id: number, qty: number) => dispatch({ type: 'UPDATE_QTY', id, qty });
  const clearCart = () => dispatch({ type: 'CLEAR' });
  const applyPromoCode = (code: PromoCode) => dispatch({ type: 'APPLY_PROMO', code });
  const removePromoCode = () => dispatch({ type: 'REMOVE_PROMO' });

  return (
    <CartContext.Provider value={{
      ...state,
      totalCount,
      subtotal,
      discount,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQty,
      updateQuantity,
      clearCart,
      applyPromoCode,
      removePromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
