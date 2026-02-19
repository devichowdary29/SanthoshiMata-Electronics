'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';
import { Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'}`}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.563.044.8.77.388 1.192l-4.204 4.347a.562.562 0 00-.15.483l1.29 5.865c.13.593-.509 1.056-.997.747l-4.747-2.982a.563.563 0 00-.582 0l-4.748 2.982c-.488.31-1.127-.154-.997-.748l1.29-5.865a.563.563 0 00-.15-.483l-4.204-4.347c-.413-.422-.175-1.148.388-1.192l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                </svg>
            ))}
        </div>
    );
}

export default function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        async function fetchReviews() {
            const { data } = await supabase
                .from('reviews')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(3);
            if (data) setReviews(data);
        }
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="py-24 bg-[#1a1a2e] relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                    >
                        What Our Customers <span className="text-cyan-400">Say</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-400 mt-4 text-lg"
                    >
                        Real experiences from our valued clients
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, i) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 hover:border-cyan-500/30 transition-all shadow-lg hover:shadow-cyan-500/10 relative group"
                        >
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-white/10 group-hover:text-cyan-500/20 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <Avatar className="w-12 h-12 border-2 border-cyan-500/20">
                                    <AvatarFallback className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold">
                                        {review.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-white font-semibold text-lg">{review.name}</h3>
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>

                            <p className="text-gray-300 leading-relaxed italic relative z-10">
                                "{review.message}"
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
