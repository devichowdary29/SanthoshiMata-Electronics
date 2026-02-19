import { Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import ProductDetailClient from '@/components/ProductDetailClient';
import Link from 'next/link';
import { Metadata } from 'next';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const { data: product } = await supabase
        .from('products')
        .select('name, brand, specs')
        .eq('id', id)
        .single();

    if (!product) {
        return {
            title: 'Product Not Found - SanthoshiMata Electronics',
        };
    }

    return {
        title: `${product.name} - ${product.brand} | SanthoshiMata Electronics`,
        description: `Buy ${product.name}. ${product.brand} - ${product.specs}`,
    };
}

// Server-side fetching
async function getProduct(id: string) {
    const { data } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
    return data;
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await getProduct(id);

    if (!product) {
        return (
            <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
                    <p className="text-gray-400 mb-4">The product you&apos;re looking for doesn&apos;t exist.</p>
                    <Link href="/products" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                        ← Back to Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] flex items-center justify-center"><div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div></div>}>
            <ProductDetailClient initialProduct={product} />
        </Suspense>
    );
}
