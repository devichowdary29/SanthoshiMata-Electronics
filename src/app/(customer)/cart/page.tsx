'use client';

import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-[#1e2a4a] rounded-full flex items-center justify-center mb-6">
                    <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Your cart is empty</h1>
                <p className="text-gray-400 mb-8 max-w-sm">Looks like you haven&apos;t added any items yet. Explore our premium TVs to find your perfect match.</p>
                <Link href="/products" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div key={item.product.id} className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
                                {/* Image */}
                                <div className="w-24 h-24 bg-[#0f0f23] rounded-lg overflow-hidden shrink-0 border border-white/5">
                                    {item.product.image_url ? (
                                        <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-white font-medium truncate pr-4">{item.product.name}</h3>
                                            <p className="text-gray-400 text-sm mb-1">{item.product.brand} • {item.product.screen_size}</p>
                                            <p className="text-cyan-400 font-semibold">₹{item.product.price.toLocaleString()}</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-500 hover:text-red-400 transition-colors p-1">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Quantity */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex items-center bg-[#0f0f23] rounded-lg border border-white/10">
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button onClick={clearCart} className="text-sm text-red-400 hover:text-red-300 transition-colors">
                            Clear Shopping Cart
                        </button>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{getTotal().toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                                <div className="border-t border-white/10 pt-3 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{getTotal().toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => router.push(user ? '/checkout' : '/login?redirect=/checkout')}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
                            >
                                Proceed to Checkout
                            </button>

                            <p className="text-center text-xs text-gray-500 mt-4">
                                Secure checkout with UPI or Cash
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
