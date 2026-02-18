'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Review } from '@/lib/types';

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'text-amber-400' : 'text-gray-600'}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
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
                .limit(6);
            if (data) setReviews(data);
        }
        fetchReviews();
    }, []);

    if (reviews.length === 0) return null;

    return (
        <section className="py-16 bg-[#1a1a2e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white">Customer Reviews</h2>
                    <p className="text-gray-400 mt-2">What our happy customers say about us</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6 hover:border-cyan-500/20 transition-all"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {review.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{review.name}</p>
                                    <StarRating rating={review.rating} />
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm leading-relaxed">{review.message}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
