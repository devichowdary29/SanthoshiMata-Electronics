'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, ExternalLink, Smartphone } from 'lucide-react';

export default function ContactPage() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#0f0f23] text-white selection:bg-cyan-500/30">
            {/* Hero Section */}
            <section className="relative py-20 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                    >
                        Get in <span className="text-cyan-400">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-gray-400 text-lg max-w-2xl mx-auto"
                    >
                        Visit our showroom for an immersive experience or reach out to us for expert advice on your next purchase.
                    </motion.p>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Address Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                                <MapPin className="w-6 h-6 text-cyan-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Showroom Address</h3>
                            <p className="text-gray-300 leading-relaxed">
                                <span className="font-semibold"><span className="text-white">SanthoshiMata</span> <span className="text-blue-500">Electronics</span></span>,<br />
                                Laxmi Nagar, Godavarikhani,<br />
                                Telangana, 505209
                            </p>
                            <a
                                href="https://maps.app.goo.gl/jvPpBMywg2aBJb3aA?g_st=iw"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 mt-4 text-cyan-400 hover:text-cyan-300 font-medium text-sm transition-colors"
                            >
                                Get Directions <ExternalLink className="w-3 h-3" />
                            </a>
                        </motion.div>

                        {/* Contact Numbers */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group"
                        >
                            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-500/20 transition-colors">
                                <Phone className="w-6 h-6 text-purple-400" />
                            </div>
                            <h3 className="text-xl font-semibold mb-4">Contact Numbers</h3>
                            <div className="space-y-3">
                                <a href="tel:9849845766" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                    <Smartphone className="w-4 h-4 text-gray-500" />
                                    +91 98498 45766
                                </a>
                                <a href="tel:9849578288" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                                    <Smartphone className="w-4 h-4 text-gray-500" />
                                    +91 98495 78288
                                </a>
                            </div>
                        </motion.div>

                        {/* Email & Timings */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors group"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
                                    <Clock className="w-6 h-6 text-amber-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold">Store Timings</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider">Open 7 days a week</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-b border-white/5 pb-6 mb-6">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Mon - Sat</span>
                                    <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">9:00 AM - 10:00 PM</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-gray-400">Sunday</span>
                                    <span className="text-white font-medium bg-white/5 px-2 py-1 rounded">10:00 AM - 9:00 PM</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-gray-500" />
                                <a href="mailto:rkkantipoodi@gmail.com" className="text-gray-300 hover:text-cyan-400 transition-colors text-sm">
                                    rkkantipoodi@gmail.com
                                </a>
                            </div>
                        </motion.div>
                    </div>

                    {/* Map & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Map Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="h-[400px] lg:h-[500px] bg-white/5 rounded-3xl border border-white/10 overflow-hidden relative shadow-2xl"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3795.539744866666!2d79.510274!3d18.750758!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTjCsDQ1JzAyLjciTiA3OcKwMzAnMzcuMCJF!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0, filter: 'grayscale(1) contrast(1.2) brightness(0.8)' }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="SanthoshiMata Electronics Location"
                            ></iframe>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0f0f23] via-transparent to-transparent opacity-20" />
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            <a
                                href="https://wa.me/919849845766?text=Hi!%20I%27m%20interested%20in%20visiting%20your%20store."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white p-4 rounded-xl font-semibold transition-all group shadow-lg shadow-emerald-900/20"
                            >
                                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Chat on WhatsApp</span>
                            </a>

                            <a
                                href="tel:9849845766"
                                className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-4 rounded-xl font-semibold transition-all group shadow-lg shadow-cyan-900/20"
                            >
                                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                <span>Call Now</span>
                            </a>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
