import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ProductsClient from '@/components/ProductsClient';

// Server-side fetching
async function getProducts() {
    try {
        const { data } = await supabase
            .from('products')
            .select('*')
            .eq('is_archived', false)
            .order('created_at', { ascending: false });
        return data || [];
    } catch (e) {
        console.error('Error fetching products:', e);
        return [];
    }
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] pt-24 text-center text-white">Loading...</div>}>
            <ProductsClient initialProducts={products} />
        </Suspense>
    );
}
