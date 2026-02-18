'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ServiceRequest, ServiceStatus } from '@/lib/types';

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();

        const channel = supabase
            .channel('admin-services')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, fetchServices)
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    async function fetchServices() {
        const { data } = await supabase
            .from('services')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setServices(data as ServiceRequest[]);
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        setServices(services.map(s => s.id === id ? { ...s, status: status as any } : s));
        await supabase.from('services').update({ status }).eq('id', id);
    }

    async function updateTechnician(id: string, name: string) {
        setServices(services.map(s => s.id === id ? { ...s, technician_name: name } : s));
        await supabase.from('services').update({ technician_name: name }).eq('id', id);
    }

    const filteredServices = filter === 'all'
        ? services
        : services.filter(s => s.status === filter || s.service_type === filter);

    if (loading) return <div className="text-white">Loading...</div>;

    return (
        <div className="space-y-6 max-w-full overflow-x-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold text-white">Service Requests</h1>
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-[#1e2a4a] border border-white/10 text-white rounded-lg px-4 py-2 text-sm"
                >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="repair">Repairs Only</option>
                    <option value="wall_mount">Installations Only</option>
                </select>
            </div>

            <div className="bg-[#1e2a4a]/50 border border-white/10 rounded-xl overflow-hidden min-w-[1000px]">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/20 text-gray-200 uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Service</th>
                            <th className="px-6 py-4">Schedule</th>
                            <th className="px-6 py-4">Details</th>
                            <th className="px-6 py-4">Technician</th>
                            <th className="px-6 py-4">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredServices.map(service => (
                            <tr key={service.id} className="hover:bg-white/5">
                                <td className="px-6 py-4">
                                    <div className="text-white font-medium">{service.full_name}</div>
                                    <div className="text-xs">{service.phone}</div>
                                    <div className="text-xs truncate max-w-[150px]" title={service.address}>{service.address}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="capitalize text-white">{service.service_type.replace('_', ' ')}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-white">{new Date(service.preferred_date).toLocaleDateString()}</div>
                                    <div className="text-xs">{service.time_slot}</div>
                                </td>
                                <td className="px-6 py-4">
                                    {service.description && (
                                        <div className="text-xs italic mb-1 max-w-[200px] truncate" title={service.description}>
                                            &quot;{service.description}&quot;
                                        </div>
                                    )}
                                    {service.image_url && (
                                        <button
                                            onClick={() => setPreviewImage(service.image_url)}
                                            className="text-cyan-400 text-xs hover:underline flex items-center gap-1"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                            View Image
                                        </button>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="text"
                                        defaultValue={service.technician_name || ''}
                                        onBlur={(e) => updateTechnician(service.id, e.target.value)}
                                        placeholder="Assign Tech"
                                        className="bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white w-32 focus:border-cyan-500/50 outline-none"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={service.status}
                                        onChange={(e) => updateStatus(service.id, e.target.value)}
                                        className={`bg-transparent border border-white/10 rounded px-2 py-1 text-xs font-bold uppercase outline-none ${service.status === 'confirmed' ? 'text-emerald-400' :
                                            service.status === 'pending' ? 'text-amber-400' :
                                                service.status === 'in_progress' ? 'text-purple-400' :
                                                    service.status === 'completed' ? 'text-blue-400' : 'text-red-400'
                                            }`}
                                    >
                                        <option value="pending" className="bg-[#1e2a4a]">Pending</option>
                                        <option value="confirmed" className="bg-[#1e2a4a]">Confirmed</option>
                                        <option value="in_progress" className="bg-[#1e2a4a]">In Progress</option>
                                        <option value="completed" className="bg-[#1e2a4a]">Completed</option>
                                        <option value="cancelled" className="bg-[#1e2a4a]">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
