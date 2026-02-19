'use client';

import { motion } from 'framer-motion';

const brands = [
    { name: 'Sony', color: '#000000' },
    { name: 'Samsung', color: '#1428A0' },
    { name: 'LG', color: '#A50034' },
    { name: 'Mi', color: '#FF6700' },
    { name: 'OnePlus', color: '#EB0028' },
    { name: 'TCL', color: '#003DA5' },
    { name: 'Speedcon', color: '#E53935' },
];

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function BrandHighlights() {
    return (
        <section className="py-16 bg-[#0f0f23] border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center text-cyan-400 font-medium tracking-widest uppercase mb-10 text-sm"
                >
                    Authorized Dealer For
                </motion.p>
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="flex flex-wrap items-center justify-center gap-6 md:gap-10"
                >
                    {brands.map((brand) => (
                        <motion.div
                            key={brand.name}
                            variants={item}
                            whileHover={{ scale: 1.05, borderColor: "rgba(34, 211, 238, 0.4)" }}
                            className="group relative px-8 py-4 bg-white/5 rounded-2xl border border-white/10 transition-all cursor-default"
                        >
                            <span className="text-xl md:text-2xl font-bold text-gray-400 group-hover:text-white transition-colors tracking-wide">
                                {brand.name}
                            </span>
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all"></div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
