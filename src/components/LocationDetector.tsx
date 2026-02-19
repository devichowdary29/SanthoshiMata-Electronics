'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Shop coordinates (Godavarikhani)
const SHOP_LAT = 18.750758;
const SHOP_LNG = 79.510274;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

export default function LocationDetector() {
    const [distance, setDistance] = useState<string | null>(null);
    const [show, setShow] = useState(false);

    useEffect(() => {
        // Automatically try to get location if permission is granted
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const dist = calculateDistance(
                        position.coords.latitude,
                        position.coords.longitude,
                        SHOP_LAT,
                        SHOP_LNG
                    );
                    setDistance(dist);
                    setShow(true);
                },
                (error) => {
                    console.log('Location access denied or error:', error);
                }
            );
        }
    }, []);

    if (!show || !distance) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-24 right-6 z-30 bg-[#1e2a4a]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl max-w-xs"
            >
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-white text-sm font-medium mb-1">
                            You are <span className="text-cyan-400 font-bold">{distance} km</span> away from our store.
                        </p>
                        <a
                            href="https://maps.app.goo.gl/YourShortLinkHere"
                            // Using generic link as placeholder, ideally replace with exact location link
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-gray-400 hover:text-white underline flex items-center gap-1 mt-1"
                        >
                            Get Directions
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    </div>
                    <button
                        onClick={() => setShow(false)}
                        className="text-gray-500 hover:text-white"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
