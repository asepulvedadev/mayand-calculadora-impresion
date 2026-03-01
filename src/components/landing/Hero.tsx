'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Scissors, Printer, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&q=80',
    tag: 'Impresión Gran Formato',
    title: 'Publicidad de\nAlto Impacto',
    subtitle: 'Vinil, lona y materiales especiales con tintas UV de alta resistencia.',
  },
  {
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=1200&q=80',
    tag: 'Corte Láser',
    title: 'Precisión\nIndustrial',
    subtitle: 'Corte y grabado en acrílico, madera, MDF y metales.',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200&q=80',
    tag: 'Catálogo',
    title: 'Productos\nListos',
    subtitle: 'Trofeos, alcancías, señalética y más. Precios de mayoreo disponibles.',
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
    setProgress(0);
  }, []);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    setProgress(0);
  }, []);

  // Auto-advance every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + 100 / 60; // 60 ticks in 6s (100ms each)
      });
    }, 100);
    return () => clearInterval(interval);
  }, [current, next]);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden">
      {/* Background image with transition */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url("${s.image}")`,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#080422] via-[#080422]/85 to-[#080422]/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#080422] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 pt-16 sm:pt-24 pb-20 sm:pb-32 min-h-[85vh] sm:min-h-[90vh] flex flex-col justify-end sm:justify-center">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFD700]/15 border border-[#FFD700]/30 rounded-full w-fit mb-5 sm:mb-6">
          <span className="size-1.5 rounded-full bg-[#FFD700] animate-pulse" />
          <span className="text-[#FFD700] text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em]">
            {slide.tag}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-white text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-5 sm:mb-6 max-w-4xl whitespace-pre-line">
          {slide.title.split('\n').map((line, i) => (
            <span key={i}>
              {i === 1 ? (
                <span className="bg-gradient-to-r from-[#458FFF] to-[#A855F7] bg-clip-text text-transparent">{line}</span>
              ) : (
                line
              )}
              {i === 0 && <br />}
            </span>
          ))}
        </h1>

        {/* Subtitle */}
        <p className="text-white/50 text-sm sm:text-lg max-w-lg mb-8 sm:mb-10 leading-relaxed">
          {slide.subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 mb-10 sm:mb-0">
          <Link
            href="/admin/calculadora"
            className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-[#458FFF] text-white text-sm sm:text-base font-bold rounded-xl hover:bg-[#3a7de6] transition-all active:scale-95 shadow-lg shadow-[#458FFF]/25"
          >
            <Printer size={18} />
            Cotizar Impresión
          </Link>
          <Link
            href="/admin/corte-laser"
            className="flex items-center justify-center gap-2 px-6 py-3.5 sm:py-4 bg-white/[0.06] border border-white/10 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm"
          >
            <Scissors size={18} />
            Cotizar Corte Láser
          </Link>
        </div>

        {/* Slide controls — bottom bar */}
        <div className="absolute bottom-6 left-4 right-4 sm:bottom-10 sm:left-auto sm:right-10 flex items-center gap-4">
          <button onClick={prev} className="p-2 rounded-lg bg-white/[0.08] text-white/50 hover:bg-white/15 transition-colors active:scale-95">
            <ChevronLeft size={18} />
          </button>

          {/* Progress dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => { setCurrent(i); setProgress(0); }}
                className="relative h-1.5 rounded-full overflow-hidden transition-all"
                style={{ width: i === current ? 40 : 12 }}
              >
                <div className="absolute inset-0 bg-white/20 rounded-full" />
                {i === current && (
                  <div
                    className="absolute inset-y-0 left-0 bg-[#458FFF] rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                )}
                {i < current && <div className="absolute inset-0 bg-white/40 rounded-full" />}
              </button>
            ))}
          </div>

          <button onClick={next} className="p-2 rounded-lg bg-white/[0.08] text-white/50 hover:bg-white/15 transition-colors active:scale-95">
            <ChevronRight size={18} />
          </button>

          <span className="hidden sm:block text-white/20 text-xs font-mono ml-2">
            {String(current + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
