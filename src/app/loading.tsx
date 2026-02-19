export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[60vh] bg-[#1a1a2e]">
            <div className="relative">
                {/* Outer Ring */}
                <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-cyan-500 animate-spin"></div>

                {/* Inner Pulse */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-cyan-500/20 animate-pulse"></div>
                </div>
            </div>
            <span className="sr-only">Loading...</span>
        </div>
    );
}
