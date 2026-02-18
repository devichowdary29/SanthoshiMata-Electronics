'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { ServiceType } from '@/lib/types';

const SERVICE_TYPES: { id: ServiceType; label: string }[] = [
    { id: 'wall_mount', label: 'Wall Mount Installation' },
    { id: 'demo', label: 'Product Demo' },
    { id: 'repair', label: 'TV Repair' },
];

const TIME_SLOTS = [
    '9:00 AM – 11:00 AM',
    '11:00 AM – 1:00 PM',
    '2:00 PM – 4:00 PM',
    '4:00 PM – 6:00 PM',
];

export default function ServiceBookingPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [serviceType, setServiceType] = useState<ServiceType>('wall_mount');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState(TIME_SLOTS[0]);
    const [imageFile, setImageFile] = useState<File | null>(null);

    // Populate user data if logged in
    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/services');
        } else if (user) {
            // Fetch profile to pre-fill? simplified for now just generic fill if we had it
            // For now, we don't have phone/address in auth metadata easily without profile fetch
            // But we can leave blank.
        }
    }, [user, authLoading, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!user) return;
        setLoading(true);

        try {
            let imageUrl = null;

            // Upload image if repair and file exists
            if (serviceType === 'repair' && imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from('service-uploads')
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('service-uploads')
                    .getPublicUrl(fileName);

                imageUrl = urlData.publicUrl;
            }

            const { error } = await supabase.from('services').insert({
                user_id: user.id,
                full_name: fullName,
                phone,
                address,
                service_type: serviceType,
                description: serviceType === 'repair' ? description : null,
                preferred_date: date,
                time_slot: timeSlot,
                image_url: imageUrl,
                status: 'pending'
            });

            if (error) throw error;

            router.push('/my-services?success=true');

        } catch (error) {
            console.error('Error booking service:', error);
            alert('Failed to book service. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) return <div className="min-h-screen bg-[#0f0f23] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#0f0f23] pt-24 px-4 pb-12">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Book a Service</h1>
                    <p className="text-gray-400">Schedule installation, demo, or repair for your Smart TV</p>
                </div>

                <div className="bg-[#1e2a4a]/40 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Personal Details */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows={3}
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none resize-none"
                                placeholder="Complete address with landmark"
                            />
                        </div>

                        {/* Service Details */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">Service Type</label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {SERVICE_TYPES.map((type) => (
                                    <div
                                        key={type.id}
                                        onClick={() => setServiceType(type.id)}
                                        className={`cursor-pointer rounded-xl p-4 border transition-all ${serviceType === type.id
                                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                                : 'bg-black/20 border-white/10 text-gray-400 hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="font-semibold">{type.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {serviceType === 'repair' && (
                            <div className="space-y-6 bg-red-500/5 p-6 rounded-xl border border-red-500/10">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Describe the Issue</label>
                                    <textarea
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={3}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none"
                                        placeholder="e.g., Screen flickering, No sound..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Upload Photo (Optional)</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                        className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none [color-scheme:dark]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Time Slot</label>
                                <select
                                    value={timeSlot}
                                    onChange={(e) => setTimeSlot(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyan-500/50 outline-none"
                                >
                                    {TIME_SLOTS.map(slot => (
                                        <option key={slot} value={slot} className="bg-[#1e2a4a] text-white">
                                            {slot}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Submitting Request...' : 'Book Service'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
