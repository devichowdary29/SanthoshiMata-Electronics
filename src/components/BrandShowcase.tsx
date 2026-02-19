'use client';

import LogoLoop from '@/components/ui/LogoLoop';
import { motion } from 'framer-motion';

const brandsData = [
    { name: 'Sony', color: '#000000' },
    { name: 'Samsung', color: '#1428A0' },
    { name: 'LG', color: '#A50034' },
    { name: 'Mi', color: '#FF6700' },
    { name: 'OnePlus', color: '#EB0028' },
    { name: 'TCL', color: '#003DA5' },
    { name: 'Speedcon', color: '#E53935' },
];

// Duplicate brands to ensure seamless loop
const brands = [...brandsData, ...brandsData, ...brandsData];

export default function BrandShowcase() {
    return (
        <section className="py-16 bg-[#0f0f23] border-t border-white/5 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center text-cyan-400 font-medium tracking-widest uppercase text-sm"
                >
                    Authorized Dealer For
                </motion.p>
            </div>

            <div className="relative w-full">
                <LogoLoop
                    logos={brands.map(brand => ({
                        node: (
                            <div className="px-8 py-4 bg-white/5 rounded-2xl border border-white/10 transition-all hover:bg-white/10 hover:border-cyan-500/30 group cursor-default min-w-[150px] flex items-center justify-center mx-4">
                                <span className="text-xl md:text-2xl font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">
                                    {brand.name}
                                </span>
                            </div>
                        ),
                        title: brand.name
                    }))}
                    direction="left"
                    speed={50} // Smooth, premium scrolling speed
                    gap={0} // Gap handled by margin in node
                    pauseOnHover={true}
                    logoHeight={80}
                    fadeOut={true}
                    fadeOutColor="#0f0f23"
                />
            </div>
        </section>
    );
}
