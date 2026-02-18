'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from './types';

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

const CartContext = createContext<CartContextType>({
    items: [],
    addToCart: () => { },
    removeFromCart: () => { },
    updateQuantity: () => { },
    clearCart: () => { },
    getTotal: () => 0,
    getItemCount: () => 0,
});

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [loaded, setLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('sm-cart');
            if (saved) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setItems(JSON.parse(saved));
            }
        } catch { /* ignore */ }
        setLoaded(true);
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem('sm-cart', JSON.stringify(items));
        }
    }, [items, loaded]);

    function addToCart(product: Product) {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id);
            if (existing) {
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    }

    function removeFromCart(productId: string) {
        setItems(prev => prev.filter(i => i.product.id !== productId));
    }

    function updateQuantity(productId: string, quantity: number) {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setItems(prev =>
            prev.map(i =>
                i.product.id === productId ? { ...i, quantity } : i
            )
        );
    }

    function clearCart() {
        setItems([]);
    }

    function getTotal() {
        return items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    }

    function getItemCount() {
        return items.reduce((sum, i) => sum + i.quantity, 0);
    }

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, getTotal, getItemCount }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
