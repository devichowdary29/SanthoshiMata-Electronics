import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f23] text-center px-4">
            <h1 className="text-9xl font-bold text-cyan-500/20">404</h1>
            <h2 className="text-4xl font-bold text-white mt-4">Page Not Found</h2>
            <p className="text-gray-400 mt-4 max-w-md">
                Oops! The page you are looking for does not exist. It might have been moved or deleted.
            </p>
            <Link
                href="/"
                className="mt-8 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all hover:-translate-y-1"
            >
                Return Home
            </Link>
        </div>
    );
}
