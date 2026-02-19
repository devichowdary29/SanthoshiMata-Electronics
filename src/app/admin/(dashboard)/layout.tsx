'use client';

import { useState } from 'react';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#0b0b1e]">
                <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
                <div
                    className={`transition-all duration-300 ease-in-out ${collapsed ? 'lg:pl-20' : 'lg:pl-60'
                        }`}
                >
                    <AdminHeader />
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </AdminGuard>
    );
}
