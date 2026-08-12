"use client";

import React, { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import type { CartItem } from "@/types/order";
import { clamp } from "@/lib/utils";

const CART_KEY = "shophub_cart";

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "HYDRATE"; payload: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "HYDRATE":
      return { items: action.payload };

    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: clamp(i.quantity + action.payload.quantity, 1, i.stock) }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.productId !== action.payload) };

    case "UPDATE_QUANTITY":
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: clamp(action.payload.quantity, 1, i.stock) }
            : i
        ),
      };

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Load the saved cart from localStorage on first render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_KEY);
      if (stored) {
        dispatch({ type: "HYDRATE", payload: JSON.parse(stored) as CartItem[] });
      }
    } catch {
      // bad JSON in storage, so just start with an empty cart
    }
  }, []);

  // Save the cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(state.items));
  }, [state.items]);

  const addItem = useCallback((item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }), []);
  const removeItem = useCallback((productId: string) => dispatch({ type: "REMOVE_ITEM", payload: productId }), []);
  const updateQuantity = useCallback((productId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QUANTITY", payload: { productId, quantity } }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items: state.items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
