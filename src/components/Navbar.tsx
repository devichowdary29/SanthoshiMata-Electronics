'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Menu, ShoppingCart, User, LogOut, Package, Wrench, Home, Monitor, Info, Phone } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { getItemCount } = useCart();
    const { user, signOut } = useAuth();
    const itemCount = getItemCount();
    const pathname = usePathname();
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        setScrolled(latest > 50);
    });

    const navLinks = [
        { href: '/', label: 'Home', icon: Home },
        { href: '/products', label: 'Shop TVs', icon: Monitor },
        { href: '/services', label: 'Services', icon: Wrench },
        { href: '/about', label: 'About', icon: Info },
        { href: '/contact', label: 'Contact', icon: Phone },
    ];

    return (
        <motion.nav
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                scrolled ? "bg-[#1a1a2e]/80 backdrop-blur-md border-white/10 shadow-lg" : "bg-transparent"
            )}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group relative z-50">
                        {/* <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                            <Monitor className="w-6 h-6 text-white" />
                        </div> */}
                        <img src="/logo.png" alt="SanthoshiMata Electronics Logo" className="w-12 h-12 object-contain" />
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-white">SanthoshiMata</span> <span className="text-blue-500">Electronics</span>
                        </span>
                    </Link>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm px-2 py-1.5 rounded-full border border-white/5">
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white",
                                        isActive ? "text-white" : "text-gray-400"
                                    )}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="navbar-active"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Icons & CTA */}
                    <div className="hidden md:flex items-center gap-4">
                        {/* Cart */}
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative text-gray-300 hover:text-white hover:bg-white/10">
                                <ShoppingCart className="w-5 h-5" />
                                {itemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="absolute -top-1 -right-1 bg-cyan-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </Button>
                        </Link>

                        {/* User Profile */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-white/10 hover:ring-cyan-500/50 transition-all p-0">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
                                                {user.email?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-[#1a1a2e] border-white/10 text-gray-200" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none text-white">My Account</p>
                                            <p className="text-xs leading-none text-gray-400">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem asChild>
                                        <Link href="/orders" className="cursor-pointer hover:bg-white/10 hover:text-cyan-400 focus:bg-white/10 focus:text-cyan-400">
                                            <Package className="mr-2 h-4 w-4" />
                                            <span>My Orders</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-services" className="cursor-pointer hover:bg-white/10 hover:text-cyan-400 focus:bg-white/10 focus:text-cyan-400">
                                            <Wrench className="mr-2 h-4 w-4" />
                                            <span>Service Requests</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-white/10" />
                                    <DropdownMenuItem
                                        className="cursor-pointer text-red-400 hover:bg-red-500/10 hover:text-red-300 focus:bg-red-500/10 focus:text-red-300"
                                        onClick={() => signOut()}
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Link href="/login">
                                <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white border-0 shadow-lg shadow-cyan-500/20 rounded-full px-6">
                                    Login
                                </Button>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white hover:bg-white/10">
                                    <Menu className="w-6 h-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] bg-[#0f0f23]/95 backdrop-blur-xl border-l border-white/10 p-0 text-white border-none">
                                <SheetHeader className="p-6 border-b border-white/10">
                                    <SheetTitle className="text-left flex items-center gap-3">
                                        <img src="/logo.png" alt="SanthoshiMata Electronics Logo" className="w-10 h-10 object-contain" />
                                        <span className="text-lg font-bold">
                                            <span className="text-white">SanthoshiMata</span> <span className="text-blue-500">Electronics</span>
                                        </span>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col py-6 px-4 space-y-2">
                                    {navLinks.map((link) => {
                                        const Icon = link.icon;
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                onClick={() => setIsOpen(false)}
                                                className={cn(
                                                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                                                    isActive
                                                        ? "bg-white/10 text-cyan-400"
                                                        : "text-gray-400 hover:bg-white/5 hover:text-white"
                                                )}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{link.label}</span>
                                            </Link>
                                        );
                                    })}

                                    <div className="h-px bg-white/10 my-4" />

                                    {/* Mobile User Actions */}
                                    <div className="space-y-2">
                                        <Link
                                            href="/cart"
                                            onClick={() => setIsOpen(false)}
                                            className="flex items-center justify-between px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <ShoppingCart className="w-5 h-5" />
                                                <span className="font-medium">Cart</span>
                                            </div>
                                            {itemCount > 0 && (
                                                <Badge className="bg-cyan-500 hover:bg-cyan-600 h-6 px-2">
                                                    {itemCount}
                                                </Badge>
                                            )}
                                        </Link>

                                        {user ? (
                                            <>
                                                <Link
                                                    href="/orders"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                                >
                                                    <Package className="w-5 h-5" />
                                                    <span className="font-medium">My Orders</span>
                                                </Link>
                                                <Link
                                                    href="/my-services"
                                                    onClick={() => setIsOpen(false)}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-all"
                                                >
                                                    <Wrench className="w-5 h-5" />
                                                    <span className="font-medium">Service Requests</span>
                                                </Link>
                                                <button
                                                    onClick={() => { signOut(); setIsOpen(false); }}
                                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-medium"
                                                >
                                                    <LogOut className="w-5 h-5" />
                                                    <span>Sign Out</span>
                                                </button>
                                            </>
                                        ) : (
                                            <Link href="/login" onClick={() => setIsOpen(false)}>
                                                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white mt-4">
                                                    Login / Sign Up
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </motion.nav>
    );
}
