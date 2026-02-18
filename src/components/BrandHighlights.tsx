const brands = [
    { name: 'Sony', color: '#000000' },
    { name: 'Samsung', color: '#1428A0' },
    { name: 'LG', color: '#A50034' },
    { name: 'Mi', color: '#FF6700' },
    { name: 'OnePlus', color: '#EB0028' },
    { name: 'TCL', color: '#003DA5' },
    { name: 'Speedcon', color: '#E53935' },
];

export default function BrandHighlights() {
    return (
        <section className="py-12 bg-[#16213e]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-400 text-sm font-medium tracking-widest uppercase mb-8">
                    Authorized Dealer For
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="group relative px-6 py-3 bg-white/5 rounded-xl border border-white/10 hover:border-cyan-500/30 hover:bg-white/10 transition-all cursor-default"
                        >
                            <span className="text-lg md:text-xl font-bold text-gray-300 group-hover:text-white transition-colors tracking-wide">
                                {brand.name}
                            </span>
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
