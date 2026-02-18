'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signOut } from '@/lib/auth';

export default function AdminHeader() {
    const [email, setEmail] = useState('');
    const router = useRouter();

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setEmail(user.email || '');
        }
        getUser();
    }, []);

    async function handleLogout() {
        await signOut();
        router.replace('/admin/login');
    }

    return (
        <header className="h-14 bg-[#0f0f23] border-b border-white/10 flex items-center justify-between px-6 lg:pl-64">
            <div className="text-gray-400 text-sm">
                Welcome, <span className="text-white font-medium">{email || 'Admin'}</span>
            </div>
            <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 text-sm transition-colors"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
            </button>
        </header>
    );
}
