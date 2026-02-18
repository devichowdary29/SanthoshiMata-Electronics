import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | SanthoshiMata Electronics',
    description: 'Learn about SanthoshiMata Electronics — your trusted electronics destination in Hyderabad for over 15 years. Authorized dealer for top TV brands.',
};

const authorizedBrands = ['Sony', 'Samsung', 'LG', 'Mi / Xiaomi', 'OnePlus', 'TCL', 'Speedcon'];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0f0f23]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">About Us</h1>
                    <p className="text-gray-400 mt-2">Trusted by thousands of families in Hyderabad</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Our Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Story</h2>
                        <div className="space-y-4 text-gray-300 text-sm leading-relaxed">
                            <p>
                                Founded over <span className="text-cyan-400 font-semibold">15 years ago</span>, SanthoshiMata Electronics has been the go-to destination for families in Hyderabad looking for quality electronics at the best prices.
                            </p>
                            <p>
                                What started as a small shop has grown into one of the most trusted electronics retailers in the region. We specialize in Smart TVs from the world&apos;s leading brands — Sony, Samsung, LG, Mi, OnePlus, and TCL.
                            </p>
                            <p>
                                Our knowledgeable team helps every customer find the perfect TV for their needs and budget. We believe in building lasting relationships through honest advice, competitive pricing, and exceptional after-sales service.
                            </p>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-[#1e2a4a]/80 to-[#16213e]/80 rounded-2xl border border-white/10 flex items-center justify-center p-8 min-h-[300px]">
                        <div className="text-center">
                            <div className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2">15+</div>
                            <p className="text-gray-400 text-lg">Years of Trust</p>
                        </div>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Why Choose SanthoshiMata?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            {
                                icon: (
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                ),
                                title: '100% Genuine Products',
                                desc: 'All products come with manufacturer warranty and original bill',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ),
                                title: 'Best Price Guarantee',
                                desc: 'Competitive pricing — we match any authorized dealer price',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                ),
                                title: 'Same Day Delivery',
                                desc: 'Free delivery and professional installation in Hyderabad',
                            },
                            {
                                icon: (
                                    <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                ),
                                title: 'Expert Guidance',
                                desc: 'Knowledgeable staff to help you choose the perfect TV',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6 hover:border-cyan-500/20 transition-all text-center">
                                <div className="w-14 h-14 bg-cyan-500/10 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                                    {item.icon}
                                </div>
                                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                                <p className="text-gray-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Authorized Brands */}
                <div className="mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">Authorized Dealer For</h2>
                    <div className="flex flex-wrap items-center justify-center gap-5">
                        {authorizedBrands.map((brand) => (
                            <div
                                key={brand}
                                className="px-8 py-4 bg-[#1e2a4a]/60 rounded-xl border border-white/10 hover:border-cyan-500/30 transition-all"
                            >
                                <span className="text-xl font-bold text-gray-300">{brand}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Policies */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold">Warranty</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            All products carry full manufacturer warranty. We assist with warranty claims and service requests to ensure a hassle-free experience.
                        </p>
                    </div>

                    <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold">Return Policy</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            If you receive a damaged or defective product, we offer a replacement within 7 days of purchase. Terms and conditions apply.
                        </p>
                    </div>

                    <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-white font-semibold">Privacy Policy</h3>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Your personal information is safe with us. We collect data only for enquiry purposes and never share it with third parties.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
