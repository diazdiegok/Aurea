import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans, Syne } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { HomeSplash } from "@/components/HomeSplash";
import { SITE, getBaseUrl } from "@/lib/config";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const display = Syne({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: SITE.brandFull,
  description: SITE.manifesto,
  openGraph: {
    title: SITE.brandFull,
    description: SITE.manifesto,
    images: ["/logo.webp"],
  },
  other: {
    "supported-color-schemes": "dark",
  },
};

export const viewport = {
  themeColor: "#070707",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} ${display.variable} h-full`}
      style={{ colorScheme: "dark", backgroundColor: "#070707" }}
    >
      <body className="flex min-h-full flex-col bg-[#070707] font-sans text-[#f6f1ea] antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
          <HomeSplash />
        </CartProvider>
      </body>
    </html>
  );
}
