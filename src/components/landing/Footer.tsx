'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Footer() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8140076026';

  return (
    <footer className="w-full bg-[#050210] border-t border-white/[0.06]">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={100} height={32} className="h-6 sm:h-7 w-auto" />
            </Link>
            <span className="hidden sm:block w-px h-5 bg-white/[0.08]" />
            <p className="hidden sm:block text-white/25 text-xs">Publicidad de alto impacto</p>
          </div>

          {/* Quick links — horizontal */}
          <nav className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/" className="text-white/30 text-xs hover:text-white/60 transition-colors">Inicio</Link>
            <Link href="#servicios" className="text-white/30 text-xs hover:text-white/60 transition-colors">Servicios</Link>
            <Link href="#portafolio" className="text-white/30 text-xs hover:text-white/60 transition-colors">Portafolio</Link>
            <Link href="/catalogo" className="text-white/30 text-xs hover:text-white/60 transition-colors">Catálogo</Link>
            <a href={`mailto:ventas@${domain}`} className="text-white/30 text-xs hover:text-white/60 transition-colors">ventas@{domain}</a>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="text-white/30 text-xs hover:text-white/60 transition-colors">+52 {whatsappNumber}</a>
          </nav>

          {/* Social */}
          <div className="flex gap-2">
            <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/15 transition-all" aria-label="Instagram">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a href="#" className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/30 hover:text-white/60 hover:border-white/15 transition-all" aria-label="Facebook">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="border-t border-white/[0.04] pt-4 text-center">
          <p className="text-white/15 text-[10px]">
            © {new Date().getFullYear()} Mayand. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
