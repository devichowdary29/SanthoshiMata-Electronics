'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user || role !== 'admin') {
                router.replace('/admin/login');
            }
        }
    }, [user, role, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#0f0f23]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
                    <p className="text-gray-400 font-medium">Verifying Access...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if unauthorized to prevent flash of content
    if (!user || role !== 'admin') {
        return null;
    }

    return <>{children}</>;
}
