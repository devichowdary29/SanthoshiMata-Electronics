'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import EnquiryModal from './EnquiryModal';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';

interface FeaturedProductsProps {
    initialProducts: Product[];
}

export default function FeaturedProducts({ initialProducts = [] }: FeaturedProductsProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [loading, setLoading] = useState(false); // No loading needed initially as we have SSR data
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEnquiry, setShowEnquiry] = useState(false);

    useEffect(() => {
        async function fetchProducts() {
            // Only used for background re-validation or real-time updates
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('is_archived', false)
                .order('created_at', { ascending: false })
                .limit(4);
            if (data) setProducts(data);
        }

        // We already have initial data, so we don't need to fetch immediately.
        // But we DO need to subscribe to changes.
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

    // Framer Motion variants (kept for future use)
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
    };

    return (
        <section className="py-24 bg-[#0f0f23] relative">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Featured <span className="text-cyan-400">TVs</span></h2>
                        <p className="text-gray-400 mt-3 text-lg">Handpicked selections from top brands</p>
                    </motion.div>

                    <Link href="/products">
                        <motion.button
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ x: 5 }}
                            className="hidden sm:inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors group"
                        >
                            View All Collection
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="space-y-4">
                                <Skeleton className="h-[250px] w-full rounded-2xl bg-white/5" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-[250px] bg-white/5" />
                                    <Skeleton className="h-4 w-[200px] bg-white/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {products.map((product) => (
                            <div key={product.id}>
                                <ProductCard product={product} onEnquire={handleEnquire} />
                            </div>
                        ))}
                    </div>
                )}

                {!loading && products.length === 0 && (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ArrowRight className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">No Products Found</h3>
                        <p className="text-gray-400">Check back later for new arrivals.</p>
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
