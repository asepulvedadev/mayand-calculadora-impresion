'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/storage';

const FALLBACK_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=90',
    alt: 'Impresión gran formato',
  },
  {
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=1920&q=90',
    alt: 'Corte láser de precisión',
  },
  {
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1920&q=90',
    alt: 'Productos del catálogo',
  },
];

interface Slide {
  image: string;
  alt: string;
}

const AUTOPLAY_MS = 6000;
const TICK_MS = 50;

export function Hero() {
  const [slides, setSlides] = useState<Slide[]>(FALLBACK_SLIDES);
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetch('/api/admin/landing?section=hero')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.sections?.length) {
          const active = data.sections.filter((s: { is_active: boolean }) => s.is_active);
          if (active.length > 0) {
            setSlides(active.map((s: { image_url: string; title: string }) => ({
              image: getProductImageUrl(s.image_url),
              alt: s.title || '',
            })));
          }
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((index: number) => {
    setCurrent(index);
    setProgress(0);
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          next();
          return 0;
        }
        return p + (TICK_MS / AUTOPLAY_MS) * 100;
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [current, next]);

  return (
    <section className="relative w-full h-[calc(100svh-56px)] sm:h-[calc(100svh-64px)] overflow-hidden bg-black">
      {/* Image layers */}
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-all duration-1000 ease-out ${
            i === current
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            quality={90}
          />
        </div>
      ))}

      {/* Subtle vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/15 pointer-events-none" />

      {/* Controls */}
      <div className="absolute bottom-5 left-4 sm:bottom-8 sm:left-8 z-10 flex items-center gap-3">
        <button
          onClick={prev}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/20 hover:text-white active:scale-90 transition-all duration-200 flex items-center justify-center"
          aria-label="Anterior"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Progress bars */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="relative h-[3px] rounded-full overflow-hidden transition-all duration-300"
              style={{ width: i === current ? 48 : 14 }}
              aria-label={`Imagen ${i + 1}`}
            >
              <div className="absolute inset-0 bg-white/25 rounded-full" />
              {i === current && (
                <div
                  className="absolute inset-y-0 left-0 bg-white rounded-full transition-[width] duration-75 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              )}
              {i < current && <div className="absolute inset-0 bg-white/60 rounded-full" />}
            </button>
          ))}
        </div>

        <button
          onClick={next}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-white/70 hover:bg-white/20 hover:text-white active:scale-90 transition-all duration-200 flex items-center justify-center"
          aria-label="Siguiente"
        >
          <ChevronRight size={18} />
        </button>

        {/* Counter */}
        <span className="hidden sm:block text-white/40 text-xs font-mono ml-1 tabular-nums">
          {String(current + 1).padStart(2, '0')}/{String(slides.length).padStart(2, '0')}
        </span>
      </div>
    </section>
  );
}
