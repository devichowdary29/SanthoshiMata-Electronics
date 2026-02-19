'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { Home, ShoppingBag, User, LayoutDashboard, Wrench } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/CartContext';

gsap.registerPlugin(useGSAP);

export function PillNav() {
    const navRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();
    const { user } = useAuth();
    const { getItemCount } = useCart();
    const totalItems = getItemCount();

    useGSAP(() => {
        if (!navRef.current) return;
        gsap.fromTo(
            '.pill-nav-item',
            { y: 20, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.5,
                stagger: 0.1,
                ease: 'back.out(1.7)',
            }
        );
    }, { scope: navRef });

    // Hide on admin routes as they have their own sidebar
    if (pathname?.startsWith('/admin')) return null;

    const handleHover = (e: React.MouseEvent<HTMLAnchorElement>, isEnter: boolean) => {
        const target = e.currentTarget;
        const icon = target.querySelector('.nav-icon');
        const text = target.querySelector('.nav-text');

        if (isEnter) {
            gsap.to(target, { scale: 1.1, duration: 0.3, ease: 'power2.out' });
            gsap.to(icon, { y: -5, duration: 0.3, ease: 'power2.out' });
            gsap.to(text, { opacity: 1, y: 15, duration: 0.3, ease: 'power2.out' });
        } else {
            gsap.to(target, { scale: 1, duration: 0.3, ease: 'power2.out' });
            gsap.to(icon, { y: 0, duration: 0.3, ease: 'power2.out' });
            gsap.to(text, { opacity: 0, y: 0, duration: 0.3, ease: 'power2.out' });
        }
    };

    const links = [
        { href: '/', icon: Home, label: 'Home' },
        { href: '/products', icon: ShoppingBag, label: 'Shop' },
        { href: '/services', icon: Wrench, label: 'Services' },
        { href: '/cart', icon: ShoppingBag, label: 'Cart', badge: totalItems > 0 ? totalItems : null },
        { href: user ? '/profile' : '/login', icon: User, label: user ? 'Profile' : 'Login' },
    ];

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none lg:hidden">
            <div
                ref={navRef}
                className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl pointer-events-auto"
            >
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    const Icon = link.icon;

                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`pill-nav-item relative group flex flex-col items-center justify-center w-12 h-12 rounded-full transition-colors ${isActive ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                            onMouseEnter={(e) => handleHover(e, true)}
                            onMouseLeave={(e) => handleHover(e, false)}
                        >
                            <div className="nav-icon relative">
                                <Icon size={20} />
                                {link.badge && (
                                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-sm">
                                        {link.badge}
                                    </span>
                                )}
                            </div>
                            <span className="nav-text absolute -top-8 text-[10px] font-medium opacity-0 pointer-events-none whitespace-nowrap bg-black/80 px-2 py-1 rounded text-white backdrop-blur-sm">
                                {link.label}
                            </span>

                            {isActive && (
                                <span className="absolute bottom-1 w-1 h-1 bg-cyan-400 rounded-full" />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
