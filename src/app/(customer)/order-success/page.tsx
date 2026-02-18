'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const method = searchParams.get('method');
    const { user } = useAuth();

    // Simple state to force a quick "verification" loading effect
    const [verified, setVerified] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setVerified(true), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!user) {
        return (
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white mb-2">Order Confirmed!</h1>
                <p className="text-gray-400 mb-6">Thank you for your purchase.</p>
                <Link href="/" className="text-cyan-400 hover:text-cyan-300">Return to Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-md w-full bg-[#1e2a4a]/60 border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className={`w-10 h-10 ${verified ? 'scale-100 opacity-100' : 'scale-75 opacity-0'} transition-all duration-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-3xl font-bold text-white mb-2">Order Confirmed!</h1>
            <p className="text-gray-400 mb-8">
                Thank you for shopping with us. Your order has been placed successfully.
            </p>

            <div className="bg-[#0f0f23]/50 rounded-xl p-4 mb-8 text-left border border-white/5 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Order ID</span>
                    <span className="text-white font-mono text-sm">{orderId?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`text-xs font-bold uppercase px-2 py-0.5 rounded ${method === 'upi' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {method === 'upi' ? 'Pending Verification' : 'Confirmed'}
                    </span>
                </div>
            </div>

            <div className="space-y-3">
                <Link
                    href="/orders"
                    className="block w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                >
                    Track My Order
                </Link>
                <Link
                    href="/products"
                    className="block w-full bg-white/5 hover:bg-white/10 text-white py-3 rounded-xl font-semibold border border-white/10 transition-all"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center px-4 pt-16 pb-12">
            <Suspense fallback={<div className="text-white">Loading...</div>}>
                <OrderSuccessContent />
            </Suspense>
        </div>
    );
}
