'use client';

import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/AuthContext';
import { ServiceRequest } from '@/lib/types';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function MyServicesContent() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [services, setServices] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/my-services');
            return;
        }

        async function fetchServices() {
            if (!user) return;
            const { data } = await supabase
                .from('services')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (data) setServices(data as ServiceRequest[]);
            setLoading(false);
        }

        if (user) {
            fetchServices();
        }
    }, [user, authLoading, router]);

    if (loading) return <div className="text-white text-center py-20">Loading services...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-white">My Service Requests</h1>
                <Link href="/services" className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-cyan-500/20 transition-all">
                    + New Request
                </Link>
            </div>

            {searchParams.get('success') && (
                <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Service request submitted successfully!
                </div>
            )}

            {services.length === 0 ? (
                <div className="text-center py-16 bg-[#1e2a4a]/40 rounded-xl border border-white/5">
                    <p className="text-gray-400 mb-4">You haven&apos;t booked any services yet.</p>
                    <Link href="/services" className="text-cyan-400 hover:underline">Book a Service</Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {services.map((service) => (
                        <div key={service.id} className="bg-[#1e2a4a]/40 border border-white/10 rounded-xl p-6 hover:bg-[#1e2a4a]/60 transition-all">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-white font-bold text-lg capitalize">
                                            {service.service_type.replace('_', ' ')}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${service.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                            service.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                                                service.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                                                    service.status === 'in_progress' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                                                        'bg-red-500/20 text-red-400 border-red-500/30'
                                            }`}>
                                            {service.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                            {new Date(service.preferred_date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {service.time_slot}
                                        </div>
                                        {service.technician_name && (
                                            <div className="flex items-center gap-1.5 text-cyan-400">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                Tech: {service.technician_name}
                                            </div>
                                        )}
                                    </div>
                                    {service.description && (
                                        <p className="mt-3 text-sm text-gray-400 bg-black/20 p-3 rounded-lg border border-white/5">
                                            &quot;{service.description}&quot;
                                        </p>
                                    )}
                                </div>

                                {service.image_url && (
                                    <button
                                        onClick={() => setPreviewImage(service.image_url)}
                                        className="shrink-0 group relative overflow-hidden rounded-lg w-20 h-20 border border-white/10"
                                    >
                                        <img
                                            src={service.image_url}
                                            alt="Service Issue"
                                            className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setPreviewImage(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex items-center justify-center">
                        <button
                            onClick={() => setPreviewImage(null)}
                            className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <img
                            src={previewImage}
                            alt="Service Issue Preview"
                            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border border-white/10"
                            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image itself
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default function MyServicesPage() {
    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
                <MyServicesContent />
            </Suspense>
        </div>
    );
}
