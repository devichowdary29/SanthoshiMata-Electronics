import { supabase } from './supabase';

export async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });
    return { data, error };
}

export async function signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
}

export async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}

export async function getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

export async function isAdmin(): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const { data } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    return data?.role === 'admin';
}
