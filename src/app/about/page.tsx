'use client';

import { motion } from 'framer-motion';
import { Award, ShieldCheck, Truck, Users, CheckCircle2 } from 'lucide-react';

const authorizedBrands = ['Sony', 'Samsung', 'LG', 'Mi', 'OnePlus', 'TCL', 'Speedcon'];

export default function AboutPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0f0f23] text-white selection:bg-cyan-500/30">
            {/* Hero Section */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
                    >
                        About <span className="text-cyan-400">Us</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
                    >
                        Detailed craftsmanship, uncompromising quality, and a legacy of trust.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
                {/* Our Story & Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Our Story</h2>
                        <div className="space-y-6 text-gray-300 text-lg leading-relaxed">
                            <p>
                                Founded over <span className="text-cyan-400 font-semibold">20+ years ago</span>, SanthoshiMata Electronics has proudly served families in Godavarikhani as a trusted destination for quality electronics at the best prices.
                            </p>
                            <p>
                                What started as a small neighborhood shop has grown into one of the most reliable and respected electronics retailers in the region. Our growth has been built on customer trust, consistent service, and a commitment to delivering the latest technology to every home.
                            </p>
                            <p>
                                We specialize in Smart TVs from the world’s leading brands, including Sony, Samsung, LG, Mi, OnePlus, TCL, and Speedcon. From premium home theatre experiences to budget-friendly smart entertainment solutions, we offer a wide range of options to suit every lifestyle and need.
                            </p>
                            <p>
                                At SanthoshiMata Electronics, we believe buying a TV is more than just a transaction — it’s about enhancing your family’s entertainment experience. Our knowledgeable team ensures every customer receives honest guidance and the right product at the right value.
                            </p>
                            <p className="font-medium text-white">
                                For more than two decades, our mission has remained simple — to provide quality, affordability, and trust to every customer who chooses us.
                            </p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 blur-3xl rounded-full" />
                        <div className="relative bg-[#1e2a4a]/40 backdrop-blur-sm rounded-3xl border border-white/10 p-12 text-center overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Award className="w-48 h-48 text-cyan-400" />
                            </div>

                            <div className="relative z-10">
                                <div className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-4">
                                    20+
                                </div>
                                <div className="text-2xl font-semibold text-white mb-2">Years of Trust</div>
                                <p className="text-gray-400">Serving Godavarikhani with pride</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Why Choose SanthoshiMata?</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">We don't just sell TVs; we sell an experience backed by guarantees and expert support.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />,
                                title: '100% Genuine',
                                desc: 'Authorized dealer with manufacturer warranty on all products.',
                                color: 'emerald'
                            },
                            {
                                icon: <Award className="w-8 h-8 text-amber-400" />,
                                title: 'Best Prices',
                                desc: 'Competitive pricing matched with the best value in the market.',
                                color: 'amber'
                            },
                            {
                                icon: <Truck className="w-8 h-8 text-blue-400" />,
                                title: 'Fast Delivery',
                                desc: 'Quick and safe delivery to your doorstep in Godavarikhani.',
                                color: 'blue'
                            },
                            {
                                icon: <Users className="w-8 h-8 text-purple-400" />,
                                title: 'Expert Support',
                                desc: 'Our team guides you to choose the perfect TV for your home.',
                                color: 'purple'
                            },
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="bg-[#1e2a4a]/40 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-[#1e2a4a]/60 hover:border-cyan-500/30 transition-all group"
                            >
                                <div className={`w-14 h-14 bg-${item.color}-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {item.icon}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed text-sm">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Brands Grid */}
                <div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Authorized Partners</h2>
                    </motion.div>

                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        {authorizedBrands.map((brand, i) => (
                            <motion.div
                                key={brand}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="px-8 py-4 bg-white/5 rounded-full border border-white/10 flex items-center gap-3 hover:bg-white/10 hover:border-cyan-500/50 transition-all group cursor-default"
                            >
                                <CheckCircle2 className="w-5 h-5 text-cyan-500 group-hover:text-cyan-400" />
                                <span className="text-lg font-semibold text-gray-200 group-hover:text-white">{brand}</span>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
