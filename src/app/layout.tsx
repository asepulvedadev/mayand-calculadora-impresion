import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import PWA from "@/components/PWA";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Printología - Cotización de Impresión Gran Formato",
  description: "Cotiza tu impresión gran formato con Printología. Máquinas de hasta 160cm de ancho y 360cm de largo. Precios competitivos para vinil y lona.",
  keywords: "impresión gran formato, vinil, lona, cotización, Printología, México",
  authors: [{ name: "Printología" }],
  manifest: '/manifest.json',
  themeColor: '#110363',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <PWA />
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
