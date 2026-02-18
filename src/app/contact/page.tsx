import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us | SanthoshiMata Electronics',
    description: 'Visit SanthoshiMata Electronics in Hyderabad. Call, WhatsApp, or visit us for the best deals on Smart TVs.',
};

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-[#0f0f23]">
            {/* Header */}
            <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-12 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h1>
                    <p className="text-gray-400 mt-2">We&apos;d love to hear from you — visit our store or reach out anytime</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Info */}
                    <div className="space-y-6">
                        {/* Address */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Shop Address</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        SanthoshiMata Electronics<br />
                                        Main Road, Near Bus Stand<br />
                                        Hyderabad, Telangana 500001
                                    </p>
                                    <a
                                        href="https://maps.google.com/?q=SanthoshiMata+Electronics+Hyderabad"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 mt-3 text-cyan-400 text-sm hover:text-cyan-300 transition-colors font-medium"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                        </svg>
                                        Get Directions
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Phone</h3>
                                    <a href="tel:+919876543210" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors block">
                                        +91 98765 43210
                                    </a>
                                    <a href="tel:+919876543211" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors block mt-1">
                                        +91 98765 43211
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">WhatsApp</h3>
                                    <p className="text-gray-400 text-sm mb-2">Quick enquiries & product questions</p>
                                    <a
                                        href="https://wa.me/919876543210?text=Hi!%20I%27m%20interested%20in%20your%20Smart%20TVs.%20Please%20share%20more%20details."
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                    >
                                        Chat on WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-1">Email</h3>
                                    <a href="mailto:info@santhoshimata.com" className="text-gray-400 hover:text-cyan-400 text-sm transition-colors">
                                        info@santhoshimata.com
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Store Timings */}
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center shrink-0">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">Store Timings</h3>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between gap-6">
                                            <span className="text-gray-400">Monday - Saturday</span>
                                            <span className="text-white font-medium">9:00 AM - 9:00 PM</span>
                                        </div>
                                        <div className="flex justify-between gap-6">
                                            <span className="text-gray-400">Sunday</span>
                                            <span className="text-white font-medium">10:00 AM - 7:00 PM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Map */}
                    <div className="space-y-6">
                        <div className="bg-[#1e2a4a]/60 rounded-xl border border-white/10 overflow-hidden h-[400px]">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d243647.34203222!2d78.24323190000002!3d17.412608500000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1702000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="SanthoshiMata Electronics Location"
                            ></iframe>
                        </div>

                        {/* Quick Contact Card */}
                        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-600/10 rounded-xl border border-cyan-500/20 p-6 text-center">
                            <h3 className="text-white font-semibold text-lg mb-2">Need Help Choosing?</h3>
                            <p className="text-gray-400 text-sm mb-4">
                                Our experts can help you pick the perfect TV for your home. Call us or visit our store!
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <a
                                    href="tel:+919876543210"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                    Call Now
                                </a>
                                <a
                                    href="https://wa.me/919876543210"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all"
                                >
                                    WhatsApp Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
