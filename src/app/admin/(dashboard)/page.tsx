'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ products: 0, enquiries: 0, banners: 0 });

    useEffect(() => {
        async function fetchStats() {
            const [productsRes, enquiriesRes, bannersRes] = await Promise.all([
                supabase.from('products').select('id', { count: 'exact', head: true }),
                supabase.from('enquiries').select('id', { count: 'exact', head: true }),
                supabase.from('banners').select('id', { count: 'exact', head: true }).eq('active', true),
            ]);
            setStats({
                products: productsRes.count || 0,
                enquiries: enquiriesRes.count || 0,
                banners: bannersRes.count || 0,
            });
        }
        fetchStats();
    }, []);

    const cards = [
        {
            label: 'Total Products',
            value: stats.products,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/20',
            textColor: 'text-cyan-400',
        },
        {
            label: 'Customer Enquiries',
            value: stats.enquiries,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            ),
            color: 'from-emerald-500/20 to-green-600/20 border-emerald-500/20',
            textColor: 'text-emerald-400',
        },
        {
            label: 'Active Banners',
            value: stats.banners,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'from-amber-500/20 to-orange-600/20 border-amber-500/20',
            textColor: 'text-amber-400',
        },
    ];

    return (
        <div>
            <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className={`bg-gradient-to-br ${card.color} rounded-xl border p-6`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-400 text-sm">{card.label}</p>
                                <p className={`text-3xl font-bold ${card.textColor} mt-1`}>{card.value}</p>
                            </div>
                            <div className={`${card.textColor} opacity-50`}>{card.icon}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-[#1e2a4a]/40 rounded-xl border border-white/10 p-6">
                <h2 className="text-lg font-semibold text-white mb-3">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a href="/admin/products" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all">
                        <p className="text-white font-medium text-sm">Manage Products</p>
                        <p className="text-gray-500 text-xs mt-1">Add, edit, or remove TVs</p>
                    </a>
                    <a href="/admin/banners" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all">
                        <p className="text-white font-medium text-sm">Manage Banners</p>
                        <p className="text-gray-500 text-xs mt-1">Upload offer banners</p>
                    </a>
                    <a href="/admin/enquiries" className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-center transition-all">
                        <p className="text-white font-medium text-sm">View Enquiries</p>
                        <p className="text-gray-500 text-xs mt-1">Customer messages</p>
                    </a>
                </div>
            </div>
        </div>
    );
}
