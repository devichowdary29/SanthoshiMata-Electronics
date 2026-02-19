'use client';

import { useAuth } from '@/lib/AuthContext';
import { motion } from 'framer-motion';
import { LogOut, Mail, User, Calendar, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SimpleProfileCard() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) return null;

    const handleLogout = async () => {
        await signOut();
        router.push('/login');
    };

    // Generate specific avatar based on email/id to keep it consistent
    const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}&backgroundColor=b6e3f4`;
    const joinDate = new Date(user.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm bg-[#1e2a4a]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-[#1e2a4a]/60 transition-all duration-500"
        >
            {/* Background Gradient Blob */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-colors" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl group-hover:bg-purple-500/30 transition-colors" />

            {/* Avatar Section */}
            <div className="relative mb-6 flex justify-center">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative w-24 h-24 rounded-full p-1 bg-gradient-to-br from-cyan-400 to-purple-600"
                >
                    <div className="w-full h-full rounded-full overflow-hidden bg-[#0f0f23] border-4 border-[#0f0f23]">
                        <img
                            src={avatarUrl}
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </motion.div>
                <div className="absolute bottom-1 right-[35%] bg-emerald-500 w-4 h-4 rounded-full border-2 border-[#0f0f23]" title="Online" />
            </div>

            {/* User Info */}
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-white mb-1">
                    {user.user_metadata?.full_name || 'Valued Customer'}
                </h2>
                <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{user.email}</span>
                </div>
            </div>

            {/* Details Grid */}
            <div className="grid gap-3 mb-8">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Member Since</p>
                        <p className="text-sm font-medium text-white">{joinDate}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">Account Status</p>
                        <p className="text-sm font-medium text-white">Verified Customer</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <button
                onClick={handleLogout}
                className="w-full py-3 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                <LogOut className="w-4 h-4" />
                Sign Out
            </button>
        </motion.div>
    );
}
