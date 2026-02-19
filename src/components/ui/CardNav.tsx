'use client';

import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowUpRight } from 'lucide-react';
import './CardNav.css';

type CardNavLink = {
    label: string;
    href: string;
    ariaLabel: string;
};

export type CardNavItem = {
    label: string;
    bgColor: string;
    textColor: string;
    links: CardNavLink[];
};

export interface CardNavProps {
    logo: string;
    logoAlt?: string;
    items: CardNavItem[];
    className?: string;
    ease?: string;
    baseColor?: string;
    menuColor?: string;
    buttonBgColor?: string;
    buttonTextColor?: string;
    onCtaClick?: () => void;
    ctaLabel?: string;
}

const CardNav: React.FC<CardNavProps> = ({
    logo,
    logoAlt = 'Logo',
    items,
    className = '',
    ease = 'power3.out',
    baseColor = '#fff',
    menuColor,
    buttonBgColor,
    buttonTextColor,
    onCtaClick,
    ctaLabel = 'Get Started'
}) => {
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const navRef = useRef<HTMLDivElement | null>(null);
    const cardsRef = useRef<HTMLDivElement[]>([]);
    const tlRef = useRef<gsap.core.Timeline | null>(null);

    const calculateHeight = () => {
        const navEl = navRef.current;
        if (!navEl) return 260;

        const isMobile = window.matchMedia('(max-width: 768px)').matches;
        // For desktop, we calculate based on the grid height
        // For mobile, we calculate based on the stack height

        // Create a temporary clone to measure if needed, or measure content directly
        const contentEl = navEl.querySelector('.card-nav-content') as HTMLElement;
        if (contentEl) {
            // Force layout measurement
            const topBar = 60;
            const padding = 16;

            // We need to know the scroll height of the content
            // Temporarily make it visible/auto height to measure
            const wasVisible = contentEl.style.visibility;
            const wasPosition = contentEl.style.position;
            const wasHeight = contentEl.style.height;
            const wasDisplay = contentEl.style.display;

            contentEl.style.visibility = 'hidden';
            contentEl.style.position = 'absolute';
            contentEl.style.height = 'auto';
            contentEl.style.display = isMobile ? 'flex' : 'grid'; // Ensure correct layout for measurement

            const contentHeight = contentEl.scrollHeight;

            // Restore
            contentEl.style.visibility = wasVisible;
            contentEl.style.position = wasPosition;
            contentEl.style.height = wasHeight;
            contentEl.style.display = wasDisplay;

            return topBar + contentHeight + padding;
        }

        return isMobile ? 600 : 350; // Fallback
    };

    const createTimeline = () => {
        const navEl = navRef.current;
        if (!navEl) return null;

        // Reset initial states
        gsap.set(navEl, { height: 60, overflow: 'hidden' });
        gsap.set(cardsRef.current, { y: 50, opacity: 0 });

        const tl = gsap.timeline({ paused: true });

        tl.to(navEl, {
            height: calculateHeight,
            duration: 0.4,
            ease
        });

        tl.to(cardsRef.current, { y: 0, opacity: 1, duration: 0.4, ease, stagger: 0.08 }, '-=0.2');

        return tl;
    };

    useLayoutEffect(() => {
        const tl = createTimeline();
        tlRef.current = tl;

        return () => {
            tl?.kill();
            tlRef.current = null;
        };
    }, [ease, items]);

    useLayoutEffect(() => {
        const handleResize = () => {
            if (!tlRef.current) return;

            // Re-create timeline on resize to capture new heights
            if (isExpanded) {
                const newHeight = calculateHeight();
                gsap.to(navRef.current, { height: newHeight, duration: 0.3, ease });

                // We don't necessarily need to kill/recreate the whole Timeline if just height changes
                // But for Simplicity/Robustness, users code did re-create. 
                // We'll trust the logic: if expanded, ensure height is correct.
            } else {
                // If closed, just ensure the timeline is ready with new potential heights
                tlRef.current.kill();
                const newTl = createTimeline();
                tlRef.current = newTl;
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded, ease, items]); // Added dependencies

    const toggleMenu = () => {
        const tl = tlRef.current;
        if (!tl) return;
        if (!isExpanded) {
            setIsHamburgerOpen(true);
            setIsExpanded(true);
            tl.play(0);
        } else {
            setIsHamburgerOpen(false);
            tl.eventCallback('onReverseComplete', () => setIsExpanded(false));
            tl.reverse();
        }
    };

    const setCardRef = (i: number) => (el: HTMLDivElement | null) => {
        if (el) cardsRef.current[i] = el;
    };

    return (
        <div className={`card-nav-container ${className}`}>
            <nav ref={navRef} className={`card-nav ${isExpanded ? 'open' : ''}`} style={{ backgroundColor: baseColor }}>
                <div className="card-nav-top">
                    <div
                        className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}
                        onClick={toggleMenu}
                        role="button"
                        aria-label={isExpanded ? 'Close menu' : 'Open menu'}
                        tabIndex={0}
                        style={{ color: menuColor || '#fff' }}
                    >
                        <div className="hamburger-line" />
                        <div className="hamburger-line" />
                        <div className="hamburger-line" />
                    </div>

                    <div className="logo-container">
                        {logo.startsWith('http') || logo.startsWith('/') ? (
                            <img src={logo} alt={logoAlt} className="logo" />
                        ) : (
                            <span className="text-sm sm:text-lg md:text-xl font-bold leading-tight text-center line-clamp-2">{logo}</span>
                        )}
                    </div>

                    <button
                        type="button"
                        className="card-nav-cta-button"
                        style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
                        onClick={onCtaClick}
                    >
                        {ctaLabel}
                    </button>
                </div>

                <div className="card-nav-content" aria-hidden={!isExpanded}>
                    {(items || []).slice(0, 3).map((item, idx) => (
                        <div
                            key={`${item.label}-${idx}`}
                            className="nav-card"
                            ref={setCardRef(idx)}
                            style={{ backgroundColor: item.bgColor, color: item.textColor }}
                        >
                            <div className="nav-card-label">{item.label}</div>
                            <div className="nav-card-links">
                                {item.links?.map((lnk, i) => (
                                    <a key={`${lnk.label}-${i}`} className="nav-card-link" href={lnk.href} aria-label={lnk.ariaLabel}>
                                        <ArrowUpRight className="nav-card-link-icon" aria-hidden="true" />
                                        {lnk.label}
                                    </a>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
};

export default CardNav;
