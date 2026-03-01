'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Home,
  Layers,
  Image as ImageIcon,
  MessageCircle,
  ShoppingBag,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import { AuthButton } from '@/components/auth/AuthButton';

const NAV_ITEMS = [
  { label: 'Inicio', href: '/', icon: Home },
  { label: 'Servicios', href: '#servicios', icon: Layers },
  { label: 'Portafolio', href: '#portafolio', icon: ImageIcon },
  { label: 'Contacto', href: '#contacto', icon: MessageCircle },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHash, setActiveHash] = useState('/');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Track active section
  useEffect(() => {
    const onHashChange = () => setActiveHash(window.location.hash || '/');
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#080422]/95 backdrop-blur-2xl border-b border-white/[0.06] shadow-xl shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4 sm:py-5">
          {/* Logo */}
          <Link href="/" className="shrink-0 group relative">
            <Image
              src="/LOGO_LIGHT.svg"
              alt="Mayand"
              width={120}
              height={36}
              className="h-7 sm:h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-2 bg-[#458FFF]/0 group-hover:bg-[#458FFF]/5 rounded-xl transition-colors duration-300" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-0.5" style={{ fontFamily: 'var(--font-display)' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeHash === item.href || (item.href === '/' && activeHash === '');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setActiveHash(item.href)}
                  className={`relative flex items-center gap-2 px-4 py-2 text-[13px] font-semibold tracking-wide uppercase rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/80'
                  }`}
                >
                  <item.icon
                    size={15}
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-[#458FFF]' : 'text-white/25 group-hover:text-[#458FFF]/60'
                    }`}
                  />
                  <span>{item.label}</span>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-5 h-[2px] bg-[#458FFF] rounded-full" />
                  )}
                </Link>
              );
            })}

            {/* Divider */}
            <div className="w-px h-6 bg-white/[0.08] mx-2" />

            {/* Catalog CTA */}
            <Link
              href="/catalogo"
              className="group relative flex items-center gap-2 ml-1 px-5 py-2.5 text-[13px] font-bold tracking-wide uppercase rounded-xl overflow-hidden transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {/* Gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#458FFF] to-[#6C5CE7] transition-opacity duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-[#3a7de6] to-[#5a4bd6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {/* Glow */}
              <span className="absolute -inset-1 bg-[#458FFF]/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <ShoppingBag size={15} className="relative z-10 text-white/80" />
              <span className="relative z-10 text-white">Catalogo</span>
            </Link>

            <div className="ml-3">
              <AuthButton />
            </div>
          </nav>

          {/* Mobile: Catalog CTA + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/catalogo"
              className="group relative flex items-center gap-1.5 px-4 py-2 text-[12px] font-bold tracking-wide uppercase rounded-xl overflow-hidden transition-all duration-300"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#458FFF] to-[#6C5CE7]" />
              <ShoppingBag size={14} className="relative z-10 text-white/80" />
              <span className="relative z-10 text-white">Catálogo</span>
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="p-2.5 rounded-xl bg-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-300"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile menu drawer */}
      <div
        className={`fixed top-0 right-0 z-[70] h-full w-[85%] max-w-sm lg:hidden transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col bg-gradient-to-b from-[#0a0530] to-[#080422] border-l border-white/[0.06]">
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.06]">
            <Link href="/" onClick={() => setOpen(false)}>
              <Image
                src="/LOGO_LIGHT.svg"
                alt="Mayand"
                width={100}
                height={32}
                className="h-6 w-auto"
              />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="p-2 rounded-xl bg-white/[0.04] text-white/40 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-4 py-6 space-y-1.5" style={{ fontFamily: 'var(--font-display)' }}>
            {NAV_ITEMS.map((item, i) => {
              const isActive = activeHash === item.href || (item.href === '/' && activeHash === '');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => { setOpen(false); setActiveHash(item.href); }}
                  className={`group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-[#458FFF]/10 border border-[#458FFF]/20'
                      : 'hover:bg-white/[0.03] border border-transparent'
                  }`}
                  style={{ transitionDelay: `${open ? i * 50 : 0}ms` }}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      isActive
                        ? 'bg-[#458FFF]/20 text-[#458FFF]'
                        : 'bg-white/[0.04] text-white/30 group-hover:bg-white/[0.06] group-hover:text-white/60'
                    }`}
                  >
                    <item.icon size={18} />
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-[15px] font-semibold tracking-wide transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'
                      }`}
                    >
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#458FFF]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Auth + branding in drawer */}
          <div className="px-4 pb-6">
            <div className="mb-4">
              <AuthButton />
            </div>
            <p
              className="text-center text-[10px] text-white/15 font-medium tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Mayand &middot; Gran Formato
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
