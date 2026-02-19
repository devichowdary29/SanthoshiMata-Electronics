import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";

import { PillNav } from "@/components/ui/PillNav";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SanthoshiMata Electronics | Premium Smart TVs in Godavarikhani",
  description: "Authorized dealer for Sony, Samsung, LG, Mi, OnePlus, TCL & Speedcon. Best prices, easy EMI, and expert service.",
  keywords: ["smart tv", "godavarikhani electronics", "samsung tv", "sony tv", "lg tv", "tv repair godavarikhani", "electronics shop"],
  metadataBase: new URL('https://santhoshimata-electronics.vercel.app'), // Replace with actual domain if available
  openGraph: {
    title: "SanthoshiMata Electronics | Premium Smart TVs",
    description: "Discover the best Smart TVs from top brands like Sony, Samsung, and LG. Visit us in Godavarikhani for exclusive deals.",
    url: 'https://santhoshimata-electronics.vercel.app',
    siteName: 'SanthoshiMata Electronics',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "SanthoshiMata Electronics | Premium Smart TVs",
    description: "Authorized dealer for Sony, Samsung, LG & more. Best prices in Godavarikhani.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ElectronicsStore",
  "name": "SanthoshiMata Electronics",
  "image": "https://santhoshimata-electronics.vercel.app/logo.png",
  "description": "Authorized dealer for Sony, Samsung, LG, Mi, OnePlus, TCL & Speedcon in Godavarikhani. Premium Smart TVs at best prices.",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Laxmi Nagar",
    "addressLocality": "Godavarikhani",
    "addressRegion": "Telangana",
    "postalCode": "505209",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 18.750758,
    "longitude": 79.510274
  },
  "url": "https://santhoshimata-electronics.vercel.app",
  "telephone": "+919849845766",
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "22:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Sunday",
      "opens": "10:00",
      "closes": "21:00"
    }
  ],
  "priceRange": "₹₹"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-[#0f0f23] text-white selection:bg-cyan-500/30 selection:text-cyan-200`}>
        <AuthProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
