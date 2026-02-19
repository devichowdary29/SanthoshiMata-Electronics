'use client';

import { Suspense } from 'react';
import SimpleProfileCard from '@/components/ui/SimpleProfileCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ProfilePage() {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0f0f23] p-4 pt-20 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-purple-500/10 rounded-full blur-[80px]" />
                <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-cyan-500/10 rounded-full blur-[80px]" />
            </div>

            <div className="w-full max-w-md z-10 relative">
                <Link
                    href="/my-services"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Services
                </Link>

                <div className="flex justify-center mb-8">
                    <SimpleProfileCard />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Link href="/orders" className="flex flex-col items-center justify-center p-4 bg-[#1e2a4a]/40 border border-white/10 rounded-2xl hover:bg-[#1e2a4a]/60 hover:border-cyan-500/30 transition-all group">
                        <div className="p-3 bg-cyan-500/10 rounded-full text-cyan-400 mb-2 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                        </div>
                        <span className="text-white font-medium">My Orders</span>
                    </Link>
                    <Link href="/my-services" className="flex flex-col items-center justify-center p-4 bg-[#1e2a4a]/40 border border-white/10 rounded-2xl hover:bg-[#1e2a4a]/60 hover:border-purple-500/30 transition-all group">
                        <div className="p-3 bg-purple-500/10 rounded-full text-purple-400 mb-2 group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </div>
                        <span className="text-white font-medium">My Services</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
