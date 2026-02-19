
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('Checking Supabase connection...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    console.log('Session:', session ? 'Active' : 'None', sessionError || '');

    console.log('Checking user_profiles table...');
    const { data, error } = await supabase.from('user_profiles').select('*').limit(5);
    if (error) {
        console.error('Error fetching user_profiles:', error);
    } else {
        console.log('user_profiles data:', data);
    }
}

check();
