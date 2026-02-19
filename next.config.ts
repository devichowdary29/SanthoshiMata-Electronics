import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Matches any supabase project URL
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
