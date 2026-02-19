import Link from 'next/link';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock, Monitor } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#0f0f23] text-gray-300 border-t border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3">
                            <img src="/logo.png" alt="SanthoshiMata Electronics Logo" className="w-12 h-12 object-contain" />
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-white">SanthoshiMata</span> <span className="text-blue-500">Electronics</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your trusted destination for premium electronics and professional services. Experience quality and reliability with every purchase.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-pink-500 hover:text-white transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-4">
                            <li>
                                <Link href="/products" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    Shop TVs
                                </Link>
                            </li>
                            <li>
                                <Link href="/services" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    Book Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-cyan-400 transition-colors flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-1" />
                                <span className="text-sm">
                                    SanthoshiMata Electronics,<br />
                                    Laxmi Nagar, Godavarikhani,<br />
                                    Telangana, 505209
                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
                                <div className="flex flex-col text-sm">
                                    <a href="tel:9849845766" className="hover:text-white transition-colors">+91 98498 45766</a>
                                    <a href="tel:9849578288" className="hover:text-white transition-colors">+91 98495 78288</a>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-cyan-400 shrink-0" />
                                <a href="mailto:rkkantipoodi@gmail.com" className="text-sm hover:text-white transition-colors">rkkantipoodi@gmail.com</a>
                            </li>
                        </ul>
                    </div>

                    {/* Hours */}
                    <div>
                        <h3 className="text-white font-semibold mb-6">Store Timings</h3>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-cyan-400" />
                                <div className="text-sm">
                                    <div className="font-medium text-white">Mon - Sat</div>
                                    <div>9:00 AM - 10:00 PM</div>
                                </div>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <div className="text-sm">
                                    <div className="font-medium text-white">Sunday</div>
                                    <div>10:00 AM - 9:00 PM</div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-16 pt-8 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} SanthoshiMata Electronics. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
