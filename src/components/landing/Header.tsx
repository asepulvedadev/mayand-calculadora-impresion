'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Close } from '@mui/icons-material';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-white/10 px-4 md:px-12 py-3 md:py-4 bg-[#110363]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <Link href="/">
          <Image
            src="/LOGO_LIGHT.svg"
            alt="Mayand"
            width={120}
            height={40}
            className="h-8 w-auto md:h-10"
          />
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-1 justify-end gap-4 lg:gap-8 items-center">
        <nav className="hidden lg:flex items-center gap-9">
          <Link href="/" className="text-white/80 text-sm font-semibold hover:text-[#FFD700] transition-colors">
            Inicio
          </Link>
          <Link href="#servicios" className="text-white/80 text-sm font-semibold hover:text-[#FFD700] transition-colors">
            Servicios
          </Link>
          <Link href="#portafolio" className="text-white/80 text-sm font-semibold hover:text-[#FFD700] transition-colors">
            Portafolio
          </Link>
          <Link href="#contacto" className="text-white/80 text-sm font-semibold hover:text-[#FFD700] transition-colors">
            Contacto
          </Link>
        </nav>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/catalogo"
            className="flex min-w-[140px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-[#458FFF] text-white text-sm font-bold transition-all hover:bg-[#458FFF]/90 shadow-lg shadow-[#458FFF]/20"
          >
            Catálogo
          </Link>
        </div>
      </div>
      
      {/* Mobile Menu Button */}
      <button 
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <Close size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#110363]/95 backdrop-blur-md border-b border-white/10 p-4 md:hidden">
          <nav className="flex flex-col gap-4">
            <Link 
              href="/" 
              className="text-white/80 text-base font-semibold hover:text-[#FFD700] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </Link>
            <Link 
              href="#servicios" 
              className="text-white/80 text-base font-semibold hover:text-[#FFD700] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Servicios
            </Link>
            <Link 
              href="#portafolio" 
              className="text-white/80 text-base font-semibold hover:text-[#FFD700] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Portafolio
            </Link>
            <Link 
              href="#contacto" 
              className="text-white/80 text-base font-semibold hover:text-[#FFD700] transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contacto
            </Link>
            <Link 
              href="/catalogo"
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-[#458FFF] text-white text-base font-bold transition-all hover:bg-[#458FFF]/90 mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Catálogo
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
