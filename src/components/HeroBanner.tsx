'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Banner } from '@/lib/types';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';


export default function HeroBanner() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [current, setCurrent] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect

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
        }, 6000);
        return () => clearInterval(interval);
    }, [banners.length]);

    // Default content if no banners
    const defaultBanner = {
        id: 'default',
        title: 'Experience Unmatched Clarity',
        subtitle: 'Shop the Latest OLED & QLED Models from Top Brands',
        image_url: null,
        active: true,
        created_at: new Date().toISOString()
    };

    const activeBanner = banners.length > 0 ? banners[current] : defaultBanner;

    return (
        <section ref={containerRef} className="relative min-h-[500px] md:min-h-[600px] h-auto md:h-[85vh] flex items-center overflow-hidden bg-[#0f0f23]">
            {/* Background Parallax Layer */}
            <motion.div style={{ y }} className="absolute inset-0 z-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeBanner.id}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.5 }}
                        className="absolute inset-0"
                    >
                        {activeBanner.image_url ? (
                            <img
                                src={activeBanner.image_url}
                                alt={activeBanner.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a1a2e] via-[#0f0f23] to-black">
                                <div className="absolute inset-0 bg-[url('/images/hero-pattern.svg')] opacity-5 mix-blend-overlay" />
                            </div>
                        )}
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f23]/90 via-[#0f0f23]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent" />
                    </motion.div>
                </AnimatePresence>
            </motion.div>

            {/* Content Layer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
                <AnimatePresence mode="wait">
                    <div key={activeBanner.id} className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <span className="inline-block py-1 px-3 rounded-full bg-cyan-500/10 text-cyan-400 text-sm font-semibold tracking-wider mb-6 border border-cyan-500/20 backdrop-blur-sm">
                                NEW ARRIVALS
                            </span>
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
                                {activeBanner.title.split(' ').map((word, i) => (
                                    <span key={i} className="inline-block mr-4">
                                        {word === 'Unmatched' || word === 'Clarity' ? (
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">{word}</span>
                                        ) : (
                                            word
                                        )}
                                    </span>
                                ))}
                            </h1>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl leading-relaxed"
                        >
                            {activeBanner.subtitle}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link href="/products">
                                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 h-14 px-8 text-lg rounded-full shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 group">
                                    Shop Now
                                    <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/services">
                                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 h-14 px-8 text-lg rounded-full backdrop-blur-sm transition-all hover:scale-105">
                                    Book Service
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </AnimatePresence>
            </div>

            {/* Slide Indicators */}
            {banners.length > 1 && (
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-12 bg-cyan-400' : 'w-2 bg-white/20 hover:bg-white/40'
                                }`}
                            aria-label={`Go to slide ${i + 1}`}
                        />
                    ))}
                </div>
            )}


        </section>
    );
}
