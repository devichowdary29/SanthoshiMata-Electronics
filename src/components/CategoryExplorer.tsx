'use client';

import CardNav, { CardNavItem } from '@/components/ui/CardNav';
import { useRouter } from 'next/navigation';

const categories: CardNavItem[] = [
    {
        label: 'Televisions',
        bgColor: '#0f172a', // Slate 900
        textColor: '#e2e8f0',
        links: [
            { label: 'Smart TVs', href: '/products?category=smart', ariaLabel: 'Smart TVs' },
            { label: 'OLED', href: '/products?category=oled', ariaLabel: 'OLED TVs' },
            { label: 'QLED', href: '/products?category=qled', ariaLabel: 'QLED TVs' },
            { label: '4K Ultra HD', href: '/products?category=4k', ariaLabel: '4K TVs' }
        ]
    },
    {
        label: 'Audio & Accessories',
        bgColor: '#1e1b4b', // Indigo 950
        textColor: '#e0e7ff',
        links: [
            { label: 'Soundbars', href: '/products?category=soundbars', ariaLabel: 'Soundbars' },
            { label: 'Home Theater', href: '/products?category=hometheater', ariaLabel: 'Home Theater' },
            { label: 'Wall Mounts', href: '/products?category=mounts', ariaLabel: 'Wall Mounts' },
            { label: 'Cables', href: '/products?category=cables', ariaLabel: 'Cables' }
        ]
    },
    {
        label: 'Services',
        bgColor: '#164e63', // Cyan 900
        textColor: '#cffafe',
        links: [
            { label: 'Installation', href: '/services', ariaLabel: 'Installation' },
            { label: 'Repair', href: '/services', ariaLabel: 'Repair' },
            { label: 'Maintenance', href: '/services', ariaLabel: 'Maintenance' },
            { label: 'Demo Request', href: '/services', ariaLabel: 'Demo Request' }
        ]
    }
];

export default function CategoryExplorer() {
    const router = useRouter();

    return (
        <section className="py-24 bg-[#060010] border-t border-white/5 relative z-30">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Explore Our Collection</h2>
                    <p className="text-gray-400">Navigate through our premium selection of electronics and services.</p>
                </div>

                <CardNav
                    logo="Browse Categories"
                    items={categories}
                    baseColor="#0f0f23"
                    buttonBgColor="#06b6d4"
                    buttonTextColor="#ffffff"
                    menuColor="#ffffff"
                    onCtaClick={() => router.push('/products')}
                    ctaLabel="View All Products"
                    className="border border-white/10 rounded-[20px] shadow-2xl"
                />
            </div>
        </section>
    );
}
