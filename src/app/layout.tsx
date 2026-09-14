import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { CartProvider } from "@/context/CartContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
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

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: SITE.brandFull,
  description: SITE.subtitle,
  openGraph: {
    title: SITE.brandFull,
    description: SITE.subtitle,
    images: ["/logo.webp"],
  },
  other: {
    "supported-color-schemes": "light",
  },
};

export const viewport = {
  themeColor: "#f7f1ea",
  colorScheme: "only light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${serif.variable} ${sans.variable} h-full`}
      style={{ colorScheme: "only light", backgroundColor: "#f7f1ea" }}
    >
      <body className="flex min-h-full flex-col bg-[#f7f1ea] font-sans text-[#4a3b30] antialiased">
        <CartProvider>
          <Header />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
