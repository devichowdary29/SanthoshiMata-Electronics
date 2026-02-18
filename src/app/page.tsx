import HeroBanner from '@/components/HeroBanner';
import BrandHighlights from '@/components/BrandHighlights';
import FeaturedProducts from '@/components/FeaturedProducts';
import ReviewsSection from '@/components/ReviewsSection';

export default function Home() {
  return (
    <>
      <HeroBanner />
      <BrandHighlights />
      <FeaturedProducts />
      <ReviewsSection />

      {/* Trust Section */}
      <section className="py-16 bg-[#12192f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Genuine Products</h3>
              <p className="text-gray-400 text-sm">100% authorized dealer with manufacturer warranty on all products</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Easy EMI Options</h3>
              <p className="text-gray-400 text-sm">Affordable monthly installments starting from ₹999/month</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                <svg className="w-7 h-7 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">Same Day Setup</h3>
              <p className="text-gray-400 text-sm">Free delivery and professional installation on the same day</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
