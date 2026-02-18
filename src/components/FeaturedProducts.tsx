'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import EnquiryModal from './EnquiryModal';
import Link from 'next/link';

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEnquiry, setShowEnquiry] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            const { data } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(8);
            if (data) setProducts(data);
        }
        fetchProducts();

        // Real-time subscription for instant updates
        const channel = supabase
            .channel('featured-products-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
                fetchProducts();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    function handleEnquire(product: Product) {
        setSelectedProduct(product);
        setShowEnquiry(true);
    }

    return (
        <section className="py-16 bg-[#12192f]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white">Featured TVs</h2>
                        <p className="text-gray-400 mt-2">Handpicked selections from top brands</p>
                    </div>
                    <Link
                        href="/products"
                        className="hidden sm:inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
                    >
                        View All
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} onEnquire={handleEnquire} />
                    ))}
                </div>

                {products.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500">Loading products...</p>
                    </div>
                )}
            </div>

            <EnquiryModal
                product={selectedProduct}
                isOpen={showEnquiry}
                onClose={() => setShowEnquiry(false)}
            />
        </section>
    );
}
