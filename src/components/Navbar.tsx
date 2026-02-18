import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { getItemCount } = useCart();
    const { user, signOut } = useAuth();
    const itemCount = getItemCount();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a1a2e]/95 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <span className="text-xl font-bold text-white tracking-tight">
                            Santhoshi<span className="text-cyan-400">Mata</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide">
                            Home
                        </Link>
                        <Link href="/products" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide">
                            Shop TVs
                        </Link>
                        <Link href="/services" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide">
                            Services
                        </Link>
                        <Link href="/about" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide">
                            About
                        </Link>
                        <Link href="/contact" className="text-gray-300 hover:text-cyan-400 transition-colors font-medium text-sm tracking-wide">
                            Contact
                        </Link>
                    </div>

                    {/* Icons & CTA */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Cart Icon */}
                        <Link href="/cart" className="relative text-gray-300 hover:text-cyan-400 transition-colors p-1">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                            {itemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </Link>

                        {/* User Icon */}
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href="/orders" className="text-gray-300 hover:text-cyan-400 transition-colors" title="My Orders">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </Link>
                                <Link href="/my-services" className="text-gray-300 hover:text-cyan-400 transition-colors" title="My Services">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </Link>
                                <button
                                    onClick={() => signOut()}
                                    className="text-gray-400 hover:text-red-400 text-sm font-medium transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-gray-300 hover:text-white p-2"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-[#1a1a2e]/98 backdrop-blur-md border-t border-white/10">
                    <div className="px-4 py-4 space-y-3">
                        <Link href="/" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">Home</Link>
                        <Link href="/products" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">Shop TVs</Link>
                        <Link href="/services" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">Services</Link>
                        <Link href="/about" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">About</Link>
                        <Link href="/contact" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">Contact</Link>
                        <Link href="/cart" onClick={() => setIsOpen(false)} className="flex items-center justify-between text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">
                            <span>Cart</span>
                            {itemCount > 0 && <span className="bg-cyan-500 text-white text-xs px-2 py-0.5 rounded-full">{itemCount} items</span>}
                        </Link>
                        {user ? (
                            <>
                                <Link href="/orders" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">My Orders</Link>
                                <Link href="/my-services" onClick={() => setIsOpen(false)} className="block text-gray-300 hover:text-cyan-400 transition-colors font-medium py-2">My Service Requests</Link>
                                <button onClick={() => { signOut(); setIsOpen(false); }} className="block w-full text-left text-red-400 hover:text-red-300 font-medium py-2">Sign Out</button>
                            </>
                        ) : (
                            <Link href="/login" onClick={() => setIsOpen(false)} className="block bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center mt-2">Login / Sign Up</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
