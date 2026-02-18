'use client';

import AdminGuard from '@/components/admin/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AdminGuard>
            <div className="min-h-screen bg-[#0b0b1e]">
                <AdminSidebar />
                <div className="lg:pl-60">
                    <AdminHeader />
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </AdminGuard>
    );
}
