'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Order } from '@/lib/types';
import Link from 'next/link';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    const [selectedProof, setSelectedProof] = useState<string | null>(null);

    useEffect(() => {
        async function fetchOrders() {
            const { data } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
            setLoading(false);
        }

        fetchOrders();

        const channel = supabase
            .channel('admin-orders')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    async function updateStatus(orderId: string, status: string) {
        const { error } = await supabase
            .from('orders')
            .update({ order_status: status })
            .eq('id', orderId);

        if (error) alert('Failed to update status');
    }

    const filteredOrders = filter === 'all'
        ? orders
        : orders.filter(o => o.order_status === filter);

    if (loading) return <div className="text-white">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Order Management</h1>
                <div className="flex bg-[#1e2a4a] rounded-lg p-1 border border-white/10">
                    {['all', 'pending_verification', 'confirmed', 'shipped', 'delivered', 'rejected'].map(f => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f ? 'bg-cyan-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {f.replace('_', ' ').toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-[#1e2a4a]/50 border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-black/20 text-gray-200 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredOrders.map(order => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-mono text-white">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-white font-medium">{order.full_name}</p>
                                        <p className="text-xs">{order.phone}</p>
                                    </td>
                                    <td className="px-6 py-4 text-white font-bold">₹{order.total_amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <span className="uppercase text-xs font-bold">{order.payment_method}</span>
                                            {order.payment_proof_url && (
                                                <button
                                                    onClick={() => setSelectedProof(order.payment_proof_url)}
                                                    className="text-cyan-400 hover:text-cyan-300 text-xs underline"
                                                >
                                                    View Proof
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${{
                                            pending_verification: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                                            confirmed: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                                            shipped: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
                                            delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
                                            rejected: 'bg-red-500/20 text-red-400 border-red-500/30'
                                        }[order.order_status]
                                            }`}>
                                            {order.order_status.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {order.order_status === 'pending_verification' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => updateStatus(order.id, 'confirmed')}
                                                    className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-xs font-bold hover:bg-emerald-500/30"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => updateStatus(order.id, 'rejected')}
                                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold hover:bg-red-500/30"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <select
                                                value={order.order_status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className="bg-black/20 border border-white/10 text-white text-xs rounded-lg px-2 py-1.5 outline-none focus:border-cyan-500/50"
                                            >
                                                <option value="confirmed">Confirmed</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="rejected">Rejected</option>
                                            </select>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredOrders.length === 0 && (
                    <div className="p-12 text-center text-gray-500">
                        No orders found
                    </div>
                )}
            </div>

            {/* Proof Modal */}
            {selectedProof && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedProof(null)}>
                    <div className="relative max-w-2xl w-full bg-[#1e2a4a] rounded-2xl p-2 border border-white/10">
                        <img src={selectedProof} alt="Payment Proof" className="w-full h-auto rounded-xl" />
                        <button
                            className="absolute -top-4 -right-4 bg-white text-black w-8 h-8 rounded-full font-bold flex items-center justify-center hover:bg-gray-200"
                            onClick={() => setSelectedProof(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
