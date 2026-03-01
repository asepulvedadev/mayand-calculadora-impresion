'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Inicio', href: '/' },
  { label: 'Servicios', href: '#servicios' },
  { label: 'Portafolio', href: '#portafolio' },
  { label: 'Contacto', href: '#contacto' },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080422]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5 sm:py-3">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={100} height={32} className="h-6 sm:h-7 w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 text-sm text-white/50 font-medium hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/catalogo"
            className="ml-2 px-5 py-2 bg-[#458FFF] text-white text-sm font-bold rounded-lg hover:bg-[#3a7de6] transition-colors shadow-lg shadow-[#458FFF]/20"
          >
            Catálogo
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-white/60" aria-label="Menu">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-[#080422]/95 backdrop-blur-xl px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm text-white/60 font-medium hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/catalogo"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center justify-center px-4 py-3 bg-[#458FFF] text-white text-sm font-bold rounded-lg"
            >
              Catálogo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
