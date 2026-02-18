'use client';

import { Product } from '@/lib/types';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';

interface ProductCardProps {
    product: Product;
    onEnquire: (product: Product) => void;
}

export default function ProductCard({ product, onEnquire }: ProductCardProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }

    const stockBadge = {
        available: { text: 'Available Today', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        out_of_stock: { text: 'Out of Stock', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
        limited: { text: 'Limited Pieces', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    }[product.stock_status];

    const specTags = product.specs
        ? product.specs.split('|').slice(0, 3).map(s => s.trim())
        : [];

    return (
        <div className="group bg-[#1e2a4a]/80 rounded-2xl border border-white/10 hover:border-cyan-500/30 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:-translate-y-1 flex flex-col">
            {/* Image Area */}
            <div className="relative h-48 bg-gradient-to-br from-gray-800/50 to-gray-900/50 flex items-center justify-center overflow-hidden">
                {product.image_url && product.image_url.startsWith('http') ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-[80%] h-[70%] bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                {/* Stock Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border ${stockBadge.color}`}>
                    {stockBadge.text}
                </div>
                {/* EMI Badge */}
                {product.emi_available && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-full text-xs font-medium text-cyan-400">
                        EMI Available
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                        <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider">{product.brand}</p>
                        <h3 className="text-white font-semibold text-sm mt-1 leading-snug line-clamp-2 group-hover:text-cyan-300 transition-colors">
                            {product.name}
                        </h3>
                    </div>
                    <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded-md font-medium shrink-0">
                        {product.screen_size}
                    </span>
                </div>

                {/* Spec Tags */}
                <div className="flex flex-wrap gap-1.5 my-3">
                    {specTags.map((tag, i) => (
                        <span key={i} className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            {tag}
                        </span>
                    ))}
                    <span className="text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                        {product.display_type}
                    </span>
                </div>

                {/* Price */}
                <p className="text-xl font-bold text-white mt-auto">
                    ₹{product.price.toLocaleString('en-IN')}
                </p>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                    <Link
                        href={`/products/${product.id}`}
                        className="flex-1 text-center bg-white/10 hover:bg-white/15 text-white text-xs py-2.5 rounded-lg font-medium transition-all border border-white/10 hover:border-white/20"
                    >
                        View Product
                    </Link>
                    <button
                        onClick={handleAddToCart}
                        disabled={product.stock_status === 'out_of_stock'}
                        className={`flex-1 py-2.5 rounded-lg font-medium text-xs transition-all ${added
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                            }`}
                    >
                        {added ? 'Added ✓' : 'Add to Cart'}
                    </button>
                    <button
                        onClick={() => onEnquire(product)}
                        disabled={product.stock_status === 'out_of_stock'}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Enquire Now
                    </button>
                </div>
            </div>
        </div>
    );
}
