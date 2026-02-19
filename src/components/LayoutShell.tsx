'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';
import LocationDetector from './LocationDetector';
import BackToTop from './BackToTop';
import { PillNav } from './ui/PillNav';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdmin = pathname.startsWith('/admin');

    if (isAdmin) {
        return <>{children}</>;
    }

    return (
        <>
            <Navbar />
            <main className="pt-16 pb-24 min-h-screen">{children}</main>
            <Footer />
            <WhatsAppButton />
            <LocationDetector />
            <BackToTop />
            <PillNav />
        </>
    );
}
