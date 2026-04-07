'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { addItem, clearCart, computeCartTotals, removeItem, updateQty } from '@/lib/cart';
import type { CartItem, Product, ProductVariant } from '@/types/store';

type CartTotals = {
  totalQty: number;
  totalPrice: number;
};

type CartContextValue = {
  cart: CartItem[];
  totals: CartTotals;
  add: (product: Product, variant: ProductVariant, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'umkm_tasikmalaya_cart_v1';

function parseCart(value: string | null): CartItem[] {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    if (!Array.isArray(parsed)) {
      return [];
    }
    return parsed as CartItem[];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const hasHydratedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      hasHydratedRef.current = true;
      setCart(parseCart(window.localStorage.getItem(STORAGE_KEY)));
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const totals = useMemo(() => computeCartTotals(cart), [cart]);

  const value = useMemo<CartContextValue>(() => {
    return {
      cart,
      totals,
      add: (product, variant, qty = 1) => {
        setCart((current) => addItem(current, product, variant, qty));
      },
      setQty: (key, qty) => {
        setCart((current) => updateQty(current, key, qty));
      },
      remove: (key) => {
        setCart((current) => removeItem(current, key));
      },
      clear: () => {
        setCart(clearCart());
      },
    };
  }, [cart, totals]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
