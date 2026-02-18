'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/lib/types';
import Link from 'next/link';

export default function HeroBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        async function fetchBanners() {
            const { data } = await supabase
                .from('banners')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });
            if (data) setBanners(data);
        }
        fetchBanners();

        // Real-time subscription for instant updates
        const channel = supabase
            .channel('banners-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'banners' }, () => {
                fetchBanners();
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    useEffect(() => {
        if (banners.length <= 1) return;
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % banners.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [banners.length]);

    if (banners.length === 0) {
        return (
            <section className="relative h-[500px] md:h-[600px] bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-2xl">
                        Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Unmatched</span> Clarity
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl mt-4 max-w-lg">
                        Shop the Latest OLED & QLED Models from Top Brands
                    </p>
                    <Link
                        href="/products"
                        className="inline-block mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5"
                    >
                        SHOP NOW
                    </Link>
                </div>
                {/* Decorative TV Image */}
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[350px]">
                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-white/10 flex items-center justify-center shadow-2xl">
                        <div className="w-[90%] h-[85%] bg-gradient-to-br from-purple-600 via-blue-500 to-cyan-400 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="w-32 h-3 bg-gray-700 rounded-full mx-auto mt-2"></div>
                </div>
            </section>
        );
    }

    const banner = banners[current];

    return (
        <section className="relative h-[500px] md:h-[600px] flex items-center overflow-hidden">
            {/* Banner Background Image */}
            {banner.image_url && banner.image_url.startsWith('http') ? (
                <img
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                    key={banner.id}
                />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]"></div>
            )}

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30 z-10"></div>

            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden z-[5]">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight transition-all duration-500 drop-shadow-lg">
                        {banner.title || 'Experience Unmatched Clarity'}
                    </h1>
                    <p className="text-gray-200 text-lg md:text-xl mt-4 transition-all duration-500 drop-shadow-md">
                        {banner.subtitle || 'Shop the Latest OLED & QLED Models'}
                    </p>
                    <Link
                        href="/products"
                        className="inline-block mt-8 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-8 py-3.5 rounded-lg text-base font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-xl shadow-cyan-500/30 hover:shadow-cyan-500/50 hover:-translate-y-0.5"
                    >
                        SHOP NOW
                    </Link>
                </div>
            </div>

            {/* Banner Dots */}
            {banners.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? 'bg-cyan-400 w-8' : 'bg-white/30 hover:bg-white/50'
                                }`}
                            aria-label={`Go to banner ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
