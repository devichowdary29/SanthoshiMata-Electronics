'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { OrderWithItems } from '@/lib/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyOrdersPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/orders');
            return;
        }

        async function fetchOrders() {
            if (!user) return;
            // Fetch orders with their items and the related product details
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setOrders(data as unknown as OrderWithItems[]);
            }
            setLoading(false);
        }

        if (user) {
            fetchOrders();

            // Subscribe to status updates for the user's orders
            const channel = supabase
                .channel(`my-orders-${user.id}`)
                .on('postgres_changes', {
                    event: 'UPDATE',
                    schema: 'public',
                    table: 'orders',
                    filter: `user_id=eq.${user.id}`
                }, (payload) => {
                    setOrders(prev => prev.map(o => o.id === payload.new.id ? { ...o, ...payload.new } : o));
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, [user, authLoading, router]);

    const toggleOrder = (orderId: string) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center pt-24">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold text-white">My Orders</h1>
                    <Link href="/products" className="text-cyan-400 hover:text-cyan-300 text-sm">
                        Browse Products
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-12 text-center">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">No orders yet</h2>
                        <p className="text-gray-400 mb-6">Looks like you haven&apos;t placed any orders yet.</p>
                        <Link
                            href="/products"
                            className="inline-block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/20 transition-all"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const isExpanded = expandedOrders.has(order.id);
                            return (
                                <div key={order.id} className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl overflow-hidden transition-all hover:bg-[#1e2a4a]/60">
                                    {/* Order Header - Clickable to Toggle */}
                                    <div
                                        onClick={() => toggleOrder(order.id)}
                                        className="p-6 border-b border-white/5 flex flex-col md:flex-row justify-between md:items-center gap-4 cursor-pointer group"
                                    >
                                        <div className="flex items-start md:items-center gap-4">
                                            {/* Expand/Collapse Icon */}
                                            <div className={`mt-1 md:mt-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180 bg-white/10' : ''}`}>
                                                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-3 mb-1">
                                                    <span className="text-white font-mono font-medium">#{order.id.slice(0, 8)}</span>
                                                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${order.order_status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                                                            order.order_status === 'pending_verification' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                                order.order_status === 'rejected' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                                                    'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                                        }`}>
                                                        {order.order_status.replace('_', ' ')}
                                                    </span>
                                                </div>
                                                <div className="flex gap-4 text-xs text-gray-400">
                                                    <span>
                                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                                            year: 'numeric', month: 'long', day: 'numeric',
                                                        })}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="uppercase">{order.payment_method}</span>
                                                    <span>•</span>
                                                    <span>{order.order_items?.length || 0} Items</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between md:justify-end gap-4 pl-12 md:pl-0">
                                            <p className="text-2xl font-bold text-white">₹{order.total_amount.toLocaleString()}</p>
                                        </div>
                                    </div>

                                    {/* Order Items - Collapsible */}
                                    <div className={`bg-black/20 overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="p-6 space-y-4 border-b border-white/5">
                                            {order.order_items?.map((item) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                                                        {item.products?.image_url ? (
                                                            <img
                                                                src={item.products.image_url}
                                                                alt={item.products.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center bg-gray-800 text-gray-500 text-xs text-center p-1">No Image</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white font-medium text-sm line-clamp-1">{item.products?.name || 'Unknown Product'}</h4>
                                                        <p className="text-gray-400 text-xs mt-0.5">
                                                            {item.products?.brand || 'Brand'} • {item.products?.screen_size || 'Size'}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-white text-sm font-medium">₹{item.price.toLocaleString()}</p>
                                                        <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}

                                            {/* Delivery Info in Expanded View */}
                                            <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center text-sm">
                                                <div className="text-gray-400">
                                                    Delivery to: <span className="text-white font-medium ml-1">{order.full_name}</span>
                                                </div>
                                                {order.address && (
                                                    <div className="text-gray-500 text-xs max-w-[200px] text-right truncate">
                                                        {order.address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
