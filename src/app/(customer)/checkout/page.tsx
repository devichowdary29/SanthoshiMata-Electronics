'use client';

import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        address: '',
        notes: ''
    });

    const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash'>('upi');
    const [paymentFile, setPaymentFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const totalv = getTotal();

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl font-bold text-white mb-4">Cart is Empty</h1>
                <Link href="/products" className="text-cyan-400 hover:text-cyan-300">Browse Products</Link>
            </div>
        );
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            if (!user) throw new Error('You must be logged in to place an order');
            if (paymentMethod === 'upi' && !paymentFile) throw new Error('Please upload a payment screenshot');

            let paymentProofUrl = null;

            // Upload payment proof if UPI
            if (paymentMethod === 'upi' && paymentFile) {
                const ext = paymentFile.name.split('.').pop();
                const fileName = `proof_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
                const { error: uploadError } = await supabase.storage.from('payment-proofs').upload(fileName, paymentFile);
                if (uploadError) throw uploadError;

                const { data } = supabase.storage.from('payment-proofs').getPublicUrl(fileName);
                paymentProofUrl = data.publicUrl;
            }

            // Create Order
            const { data: order, error: orderError } = await supabase.from('orders').insert({
                user_id: user.id,
                full_name: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                notes: formData.notes,
                total_amount: totalv,
                payment_method: paymentMethod,
                payment_proof_url: paymentProofUrl,
                order_status: paymentMethod === 'cash' ? 'confirmed' : 'pending_verification'
            }).select().single();

            if (orderError) throw orderError;

            // Create Order Items
            const orderItems = items.map(item => ({
                order_id: order.id,
                product_id: item.product.id,
                quantity: item.quantity,
                price: item.product.price
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
            if (itemsError) throw itemsError;

            // Success
            clearCart();
            router.push(`/order-success?id=${order.id}&method=${paymentMethod}`);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Something went wrong';
            setError(errorMessage);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left: Form */}
                    <div className="space-y-6">
                        <section className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Delivery Details</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.fullName}
                                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Delivery Address</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={formData.address}
                                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-400 mb-1">Order Notes (Optional)</label>
                                    <input
                                        type="text"
                                        value={formData.notes}
                                        onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:border-cyan-500/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-6">
                            <h2 className="text-xl font-semibold text-white mb-4">Payment Method</h2>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <button
                                    onClick={() => setPaymentMethod('upi')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'upi' ? 'bg-cyan-500/10 border-cyan-500 text-cyan-400' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    <span className="font-bold">UPI Payment</span>
                                    <span className="text-xs">Scan & Pay</span>
                                </button>
                                <button
                                    onClick={() => setPaymentMethod('cash')}
                                    className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                        }`}
                                >
                                    <span className="font-bold">Cash</span>
                                    <span className="text-xs">Pay at Shop</span>
                                </button>
                            </div>

                            {paymentMethod === 'upi' && (
                                <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-lg p-5">
                                    <p className="text-sm text-cyan-200 mb-2 font-medium">1. Send ₹{totalv.toLocaleString()} to:</p>
                                    <div className="bg-black/30 p-3 rounded border border-cyan-500/20 text-center mb-4">
                                        <code className="text-xl font-mono text-cyan-400">9849845766@ybl</code>
                                    </div>
                                    <p className="text-sm text-cyan-200 mb-2 font-medium">2. Upload Payment Screenshot:</p>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        required
                                        onChange={e => setPaymentFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                                    />
                                </div>
                            )}

                            {paymentMethod === 'cash' && (
                                <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-lg p-5 flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <div>
                                        <p className="text-emerald-400 font-medium text-sm">Pay Securely at Shop</p>
                                        <p className="text-emerald-400/70 text-xs mt-1">Your order will be confirmed immediately. Please visit the shop to complete payment and collect your item.</p>
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right: Summary */}
                    <div>
                        <div className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                {items.map(item => (
                                    <div key={item.product.id} className="flex gap-3">
                                        <img src={item.product.image_url} alt={item.product.name} className="w-16 h-16 rounded-lg object-cover bg-gray-800" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium truncate">{item.product.name}</p>
                                            <p className="text-gray-400 text-xs">{item.quantity} x ₹{item.product.price.toLocaleString()}</p>
                                        </div>
                                        <p className="text-white font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-gray-400">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>₹{totalv.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                                <div className="border-t border-white/10 pt-2 flex justify-between text-white font-bold text-lg">
                                    <span>Total</span>
                                    <span>₹{totalv.toLocaleString()}</span>
                                </div>
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg">
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                            >
                                {loading ? 'Processing Order...' : `Place Order (₹${totalv.toLocaleString()})`}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
