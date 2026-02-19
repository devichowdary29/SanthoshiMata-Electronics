'use client';

import { Product } from '@/lib/types';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useState } from 'react';
import { ShoppingCart, Eye, MessageSquare, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
        available: { text: 'In Stock', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
        out_of_stock: { text: 'Out of Stock', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
        limited: { text: 'Limited', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    }[product.stock_status];

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <div className="group relative bg-[#1a1a2e]/60 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2">
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                {product.image_url ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                        <Monitor className="w-12 h-12 text-white/20" />
                    </div>
                )}

                {/* Overlay with Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Link href={`/products/${product.id}`}>
                        <Button variant="secondary" size="icon" className="rounded-full w-12 h-12 bg-white text-black hover:bg-cyan-400 hover:text-white transition-all hover:scale-110 shadow-lg">
                            <Eye className="w-5 h-5" />
                        </Button>
                    </Link>
                    <Button
                        onClick={handleAddToCart}
                        disabled={product.stock_status === 'out_of_stock'}
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "rounded-full w-12 h-12 transition-all hover:scale-110 shadow-lg",
                            added ? "bg-emerald-500 text-white" : "bg-white text-black hover:bg-cyan-400 hover:text-white",
                            product.stock_status === 'out_of_stock' && "opacity-50 cursor-not-allowed hover:bg-white hover:text-black hover:scale-100"
                        )}
                    >
                        {added ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    </Button>
                </div>

                {/* Badges */}
                <div className="absolute top-3 inset-x-3 flex justify-between items-start">
                    <Badge variant="outline" className={cn("backdrop-blur-md border", stockBadge.className)}>
                        {stockBadge.text}
                    </Badge>
                    {product.emi_available && (
                        <Badge variant="secondary" className="bg-cyan-500/90 text-white backdrop-blur-md shadow-lg shadow-cyan-500/20">
                            EMI Available
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-cyan-400 text-xs font-bold tracking-wider uppercase">{product.brand}</span>
                        <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-gray-400 font-medium">4.8</span>
                        </div>
                    </div>
                    <Link href={`/products/${product.id}`}>
                        <h3 className="text-white font-semibold text-lg leading-tight line-clamp-2 group-hover:text-cyan-400 transition-colors">
                            {product.name}
                        </h3>
                    </Link>
                </div>

                {/* Specs */}
                <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                        {product.screen_size}
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-xs text-gray-300">
                        {product.display_type}
                    </span>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs line-through decoration-red-500/50">
                            {formatPrice(product.price * 1.2)}
                        </p>
                        <p className="text-xl font-bold text-white">
                            {formatPrice(product.price)}
                        </p>
                    </div>
                    <Button
                        onClick={() => onEnquire(product)}
                        variant="outline"
                        size="sm"
                        className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                    >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Enquire
                    </Button>
                </div>
            </div>
        </div>
    );
}

function Star({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
    );
}

function Monitor({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="14" x="2" y="3" rx="2" />
            <line x1="8" x2="16" y1="21" y2="21" />
            <line x1="12" x2="12" y1="17" y2="21" />
        </svg>
    );
}
