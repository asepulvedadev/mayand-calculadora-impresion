'use client';

import Link from 'next/link';
import { Printer, Scissors } from 'lucide-react';

export function Hero() {
  return (
    <section className="@container relative">
      <div className="p-0 md:p-6 lg:p-10">
        <div 
          className="relative flex min-h-[700px] flex-col gap-6 overflow-hidden rounded-none md:rounded-[2rem] items-start justify-center px-8 md:px-24 py-24 shadow-2xl"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#110363] via-[#110363]/90 to-transparent"></div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 industrial-pattern pointer-events-none opacity-30"></div>
          <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-[#FFD700]/10 blur-[120px] rounded-full"></div>
          
          <div className="relative z-10 max-w-[800px] flex flex-col gap-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#FFD700]/20 border border-[#FFD700]/40 rounded-full w-fit backdrop-blur-md">
              <span className="size-2 rounded-full bg-[#FFD700] animate-pulse shadow-[0_0_8px_#FFD700]"></span>
              <span className="text-[#FFD700] text-xs font-bold uppercase tracking-[0.2em] leading-none">
                Precisión Industrial
              </span>
            </div>
            
            {/* Headline */}
            <h1 className="text-white text-5xl md:text-7xl font-black leading-[1.05] tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#458FFF] to-blue-400">
                Publicidad de Alto Impacto
              </span>
            </h1>
            
            {/* Subheadline */}
            <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed max-w-[650px] border-l-4 border-[#458FFF]/50 pl-6">
              Especialistas en{' '}
              <span className="text-white font-semibold">Corte Láser</span> e{' '}
              <span className="text-white font-semibold">Impresión Gran Formato</span>{' '}
              con tecnología de punta.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-5 pt-6">
              <Link 
                href="/admin/calculadora"
                className="flex min-w-[220px] cursor-pointer items-center justify-center rounded-xl h-14 px-10 bg-[#458FFF] text-white text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(69,143,255,0.5)] active:scale-95"
              >
                <Printer className="w-5 h-5 mr-2" />
                Cotizar Impresión
              </Link>
              <Link 
                href="/admin/corte-laser"
                className="flex min-w-[220px] cursor-pointer items-center justify-center rounded-xl h-14 px-10 bg-white/5 text-white text-lg font-bold border border-white/20 backdrop-blur-md transition-all hover:bg-white/10"
              >
                <Scissors className="w-5 h-5 mr-2" />
                Cotizar Corte Láser
              </Link>
            </div>
          </div>
          
          {/* Technology badge */}
          <div className="absolute bottom-12 right-12 hidden xl:flex items-center gap-5 bg-[#1a1d2e]/80 backdrop-blur-2xl p-6 rounded-2xl border border-white/10 shadow-2xl">
            <div className="flex items-center justify-center size-12 rounded-full bg-[#458FFF]/20 text-[#458FFF]">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <p className="text-white font-black text-lg leading-none mb-1">Hasta 160cm</p>
              <p className="text-white/60 text-sm tracking-wide uppercase">Ancho de Impresión</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
