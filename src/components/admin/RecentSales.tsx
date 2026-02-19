'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Order } from '@/lib/types';

interface RecentSalesProps {
    orders: Order[];
}

export function RecentSales({ orders }: RecentSalesProps) {
    return (
        <div className="space-y-8">
            {orders.map((order) => (
                <div key={order.id} className="flex items-center">
                    <Avatar className="h-9 w-9 bg-cyan-700/20 text-cyan-500 border border-cyan-500/30">
                        <AvatarFallback>
                            {order.full_name
                                ? order.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
                                : 'CN'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{order.full_name || 'Guest Customer'}</p>
                        <p className="text-sm text-gray-400">{order.order_status.replace('_', ' ')}</p>
                    </div>
                    <div className="ml-auto font-medium text-white">+₹{order.total_amount.toLocaleString('en-IN')}</div>
                </div>
            ))}
            {orders.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No recent sales found.</p>
            )}
        </div>
    );
}
