'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Product } from '@/lib/types';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import EnquiryModal from '@/components/EnquiryModal';
import { useSearchParams } from 'next/navigation';

function ProductsContent() {
    const searchParams = useSearchParams();
    const category = searchParams.get('category');

    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showEnquiry, setShowEnquiry] = useState(false);

    // Filters
    const [brandFilter, setBrandFilter] = useState<string>('all');
    const [sizeFilter, setSizeFilter] = useState<string>('all');
    const [displayFilter, setDisplayFilter] = useState<string>('all');
    const [minPrice, setMinPrice] = useState<string>('');
    const [maxPrice, setMaxPrice] = useState<string>('');
    const [sortBy, setSortBy] = useState<string>('newest');

    useEffect(() => {
        async function fetchProducts() {
            let query = supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (category) {
                // Determine if category is brand or type based on simple logic or DB structure
                // For now, let's assume category param maps to brand if it matches a brand, else ignore
                // Actually, standardizing: category param -> brand filter initial state
                setBrandFilter(prev => prev === 'all' ? category : prev);
            }

            const { data } = await query;
            if (data) {
                setProducts(data);
                // Initial filter will happen in the filter effect
            }
            setLoading(false);
        }

        fetchProducts();
    }, [category]);

    // Apply filters
    useEffect(() => {
        let result = [...products];

        if (brandFilter !== 'all') {
            result = result.filter(p => p.brand.toLowerCase() === brandFilter.toLowerCase());
        }
        if (sizeFilter !== 'all') {
            result = result.filter(p => p.screen_size === sizeFilter);
        }
        if (displayFilter !== 'all') {
            result = result.filter(p => p.display_type === displayFilter);
        }
        if (minPrice) {
            result = result.filter(p => p.price >= Number(minPrice));
        }
        if (maxPrice) {
            result = result.filter(p => p.price <= Number(maxPrice));
        }

        if (sortBy === 'price_low') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price_high') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'newest') {
            result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }

        setFilteredProducts(result);
    }, [products, brandFilter, sizeFilter, displayFilter, minPrice, maxPrice, sortBy]);

    function handleEnquire(product: Product) {
        setSelectedProduct(product);
        setShowEnquiry(true);
    }

    const clearFilters = () => {
        setBrandFilter('all');
        setSizeFilter('all');
        setDisplayFilter('all');
        setMinPrice('');
        setMaxPrice('');
        setSortBy('newest');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0f0f23] pt-24 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Extract unique options
    const brands = Array.from(new Set(products.map(p => p.brand)));
    const sizes = Array.from(new Set(products.map(p => p.screen_size)));
    const displays = Array.from(new Set(products.map(p => p.display_type)));

    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-64 flex-shrink-0 space-y-6">
                        <div className="bg-[#1e2a4a]/40 p-6 rounded-xl border border-white/5 backdrop-blur-sm sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-white">Filters</h3>
                                <button onClick={clearFilters} className="text-cyan-400 text-xs hover:underline">Clear All</button>
                            </div>

                            {/* Brand Filter */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Brand</label>
                                <select
                                    value={brandFilter}
                                    onChange={(e) => setBrandFilter(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/50"
                                >
                                    <option value="all">All Brands</option>
                                    {brands.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>

                            {/* Size Filter */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Screen Size</label>
                                <select
                                    value={sizeFilter}
                                    onChange={(e) => setSizeFilter(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/50"
                                >
                                    <option value="all">All Sizes</option>
                                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/50"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-white">
                                All Products <span className="text-gray-500 text-lg font-normal">({filteredProducts.length})</span>
                            </h1>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-[#1e2a4a]/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-200 outline-none focus:border-cyan-500/50"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_low">Price: Low to High</option>
                                <option value="price_high">Price: High to Low</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onEnquire={handleEnquire} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="text-center py-20 bg-[#1e2a4a]/20 rounded-xl border border-white/5">
                                <p className="text-gray-400">No products match your filters.</p>
                                <button onClick={clearFilters} className="mt-4 text-cyan-400 hover:underline">Clear Filters</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <EnquiryModal
                product={selectedProduct}
                isOpen={showEnquiry}
                onClose={() => setShowEnquiry(false)}
            />
        </div>
    );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0f0f23] pt-24 text-center text-white">Loading...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
