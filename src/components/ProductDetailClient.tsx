'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/lib/CartContext';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import EnquiryModal from '@/components/EnquiryModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductDetailClientProps {
    initialProduct: Product;
}

export default function ProductDetailClient({ initialProduct }: ProductDetailClientProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [showEnquiry, setShowEnquiry] = useState(false);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            if (!product?.id) return;
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('id', product.id)
                .single();
            setProduct(data);
        }

        if (product?.id) {
            // Real-time updates
            const channel = supabase
                .channel(`product-detail-${product.id}`)
                .on('postgres_changes', {
                    event: '*', schema: 'public', table: 'products',
                    filter: `id=eq.${product.id}`
                }, () => {
                    fetchProduct();
                })
                .subscribe();

            return () => { supabase.removeChannel(channel); };
        }
    }, [product?.id]);

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

    const stockBadge = {
        available: { text: 'Available Today', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        out_of_stock: { text: 'Out of Stock', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        limited: { text: 'Limited Pieces', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    }[product.stock_status];

    const specs = product.specs ? product.specs.split('|').map(s => s.trim()) : [];
    const whatsappMessage = encodeURIComponent(`Hi! I'm interested in ${product.name} (${product.screen_size}, ${product.display_type}) priced at ₹${product.price.toLocaleString('en-IN')}. Please share more details.`);

    return (
        <div className="min-h-screen bg-[#0f0f23]">
            {/* Breadcrumb */}
            <div className="bg-[#1a1a2e] border-b border-white/10 py-3">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-400 hover:text-cyan-400 transition-colors">Home</Link>
                        <span className="text-gray-600">/</span>
                        <Link href="/products" className="text-gray-400 hover:text-cyan-400 transition-colors">Products</Link>
                        <span className="text-gray-600">/</span>
                        <span className="text-white">{product.name}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Product Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-gradient-to-br from-[#1e2a4a]/80 to-[#16213e]/80 rounded-2xl border border-white/10 flex items-center justify-center p-8 min-h-[300px] md:min-h-[350px] overflow-hidden relative lg:sticky lg:top-24 self-start"
                    >
                        {product.image_url && product.image_url.startsWith('http') ? (
                            <motion.img
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-contain max-h-[400px] rounded-lg"
                            />
                        ) : (
                            <div className="w-[80%] h-[300px] bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center">
                                <svg className="w-24 h-24 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </motion.div>

                    {/* Product Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-cyan-400 text-sm font-semibold uppercase tracking-wider">{product.brand}</span>
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${stockBadge.color}`}>
                                {stockBadge.text}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
                            {product.name}
                        </h1>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="text-white/60 text-sm bg-white/10 px-3 py-1.5 rounded-lg">{product.screen_size}</span>
                            <span className="text-white/60 text-sm bg-white/10 px-3 py-1.5 rounded-lg">{product.display_type}</span>
                            {product.emi_available && (
                                <span className="text-cyan-400 text-sm bg-cyan-500/10 border border-cyan-500/20 px-3 py-1.5 rounded-lg">EMI Available</span>
                            )}
                        </div>

                        {/* Price */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-5 mb-6">
                            <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Best Price</p>
                            <p className="text-4xl font-bold text-white">
                                ₹{product.price.toLocaleString('en-IN')}
                            </p>
                            {product.emi_available && (
                                <p className="text-cyan-400 text-sm mt-1">
                                    EMI from ₹{Math.round(product.price / 12).toLocaleString('en-IN')}/month
                                </p>
                            )}
                        </div>

                        {/* Specs */}
                        <div className="mb-6">
                            <h3 className="text-white font-semibold mb-3">Key Specifications</h3>
                            <div className="flex flex-wrap gap-2">
                                {specs.map((spec, i) => (
                                    <motion.span
                                        key={i}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + (i * 0.05) }}
                                        className="text-sm text-gray-300 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
                                    >
                                        {spec}
                                    </motion.span>
                                ))}
                            </div>
                        </div>

                        {/* Warranty */}
                        {product.warranty_info && (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <svg className="w-5 h-5 text-emerald-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <div>
                                        <p className="text-emerald-400 font-medium text-sm">Warranty</p>
                                        <p className="text-gray-300 text-sm">{product.warranty_info}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        addToCart(product);
                                        setAdded(true);
                                        setTimeout(() => setAdded(false), 2000);
                                    }}
                                    disabled={product.stock_status === 'out_of_stock'}
                                    className={`flex-1 py-3.5 rounded-xl font-bold text-lg transition-all border ${added
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {added ? 'Added ✓' : (product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart')}
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        addToCart(product);
                                        router.push('/checkout');
                                    }}
                                    disabled={product.stock_status === 'out_of_stock'}
                                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-none disabled:bg-gray-700"
                                >
                                    {product.stock_status === 'out_of_stock' ? 'Out of Stock' : 'Buy Now'}
                                </motion.button>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowEnquiry(true)}
                                    // disabled={product.stock_status === 'out_of_stock'}
                                    className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Enquire Now
                                </motion.button>
                                <motion.a
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    href={`https://wa.me/919876543210?text=${whatsappMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    WhatsApp Enquiry
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <EnquiryModal
                product={product}
                isOpen={showEnquiry}
                onClose={() => setShowEnquiry(false)}
            />
        </div>
    );
}
