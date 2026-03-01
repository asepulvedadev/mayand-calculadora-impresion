import type { Metadata } from "next";
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PWA from "@/components/PWA";
import { Toaster } from "sonner";
import { ClientLayout } from "@/components/ClientLayout";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { CartProvider } from "@/lib/cart/CartContext";
import { CartModal } from "@/components/cart/CartModal";

// Import for testing (only in development)
if (process.env.NODE_ENV === 'development') {
  import("@/lib/testSupabase");
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Mayand - Cotización de Impresión Gran Formato",
  description: "Cotiza tu impresión gran formato con Mayand. Máquinas de hasta 160cm de ancho y 360cm de largo. Precios competitivos para vinil y lona.",
  keywords: "impresión gran formato, vinil, lona, cotización, Mayand, México",
  authors: [{ name: "Mayand" }],
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#110363',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
        style={{ backgroundColor: '#110363', color: 'white' }}
      >
        <PWA />
        <ErrorBoundary>
          <AuthProvider>
            <CartProvider>
              <ClientLayout>{children}</ClientLayout>
              <CartModal />
            </CartProvider>
          </AuthProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
    </html>
  );
}
