'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'customer' | null;

interface AuthContextType {
    user: User | null;
    role: UserRole;
    loading: boolean;
    signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
    signIn: (email: string, password: string) => Promise<{ error: string | null }>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    loading: true,
    signUp: async () => ({ error: null }),
    signIn: async () => ({ error: null }),
    signOut: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<UserRole>(null);
    const [loading, setLoading] = useState(true);

    // Helper to fetch role
    const fetchRole = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching role:', error);
                return null;
            }
            return data?.role as UserRole;
        } catch (err) {
            console.error('Error in fetchRole:', err);
            return null;
        }
    };

    useEffect(() => {
        let mounted = true;

        const initAuth = async () => {
            try {
                // 1. Get session
                const { data: { session }, error } = await supabase.auth.getSession();

                if (session?.user) {
                    if (mounted) setUser(session.user);

                    // 2. STALE-WHILE-REVALIDATE: Check local storage for cached role
                    const cachedRole = localStorage.getItem(`user_role_${session.user.id}`) as UserRole;
                    if (cachedRole && mounted) {
                        setRole(cachedRole);
                        setLoading(false); // Unblock immediately if we have a cache
                    }

                    // 3. Fetch latest role from DB
                    fetchRole(session.user.id).then((userRole) => {
                        if (mounted && userRole) {
                            setRole(userRole);
                            localStorage.setItem(`user_role_${session.user.id}`, userRole);
                        }
                    });
                } else {
                    if (mounted) {
                        setUser(null);
                        setRole(null);
                    }
                }
            } catch (err) {
                console.error('AuthContext: initAuth error', err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                if (mounted) setUser(session.user);

                // If we don't have a role yet (or switched users), fetch it
                if (!role || session.user.id !== user?.id) {
                    // Try cache first if we haven't already
                    const cachedRole = localStorage.getItem(`user_role_${session.user.id}`) as UserRole;
                    if (cachedRole && mounted) {
                        setRole(cachedRole);
                        setLoading(false);
                    }

                    const userRole = await fetchRole(session.user.id);
                    if (mounted && userRole) {
                        setRole(userRole);
                        localStorage.setItem(`user_role_${session.user.id}`, userRole);
                    }
                }
            } else {
                if (mounted) {
                    setUser(null);
                    setRole(null);
                }
            }
            if (mounted) setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    async function signUp(email: string, password: string, fullName: string) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) return { error: error.message };

        if (data.user) {
            // Create profile
            await supabase.from('user_profiles').insert({
                id: data.user.id,
                email: email,
                role: 'customer',
            });
            setRole('customer');
            localStorage.setItem(`user_role_${data.user.id}`, 'customer');
        }

        return { error: null };
    }

    async function signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error: error.message };
        return { error: null };
    }

    async function signOut() {
        await supabase.auth.signOut();
        setUser(null);
        setRole(null);
        // Clear cached roles? Optional, but good for privacy
        // We can't easily clear specific user role without ID, but that's fine.
    }

    return (
        <AuthContext.Provider value={{ user, role, loading, signUp, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
