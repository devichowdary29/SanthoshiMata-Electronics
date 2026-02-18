import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { AuthProvider } from "@/lib/AuthContext";
import { CartProvider } from "@/lib/CartContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SanthoshiMata Electronics | Premium Smart TVs in Godavarikhani",
  description: "Authorized dealer for Sony, Samsung, LG, Mi, OnePlus, TCL & Speedcon Smart TVs. Best prices, EMI options, and trusted service in Hyderabad.",
  keywords: "smart tv, buy tv Godavarikhani, samsung tv, sony tv, lg tv, oled tv, 4k tv, electronics shop",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#0f0f23] text-white`}>
        <AuthProvider>
          <CartProvider>
            <LayoutShell>{children}</LayoutShell>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
