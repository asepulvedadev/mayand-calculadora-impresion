'use client';

import Link from 'next/link';
import { Printer, Scissors, ArrowUpRight, Zap, Award, Clock, Layers } from 'lucide-react';

export function ServicesSection() {
  return (
    <section id="servicios" className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-10 sm:mb-14">
        <span className="text-[#458FFF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Nuestros servicios</span>
        <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
          Soluciones{' '}
          <span className="bg-gradient-to-r from-[#458FFF] to-[#A855F7] bg-clip-text text-transparent">Especializadas</span>
        </h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Service 1 — Large card (spans 2 cols) */}
        <Link
          href="/admin/calculadora"
          className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#458FFF]/15 to-[#458FFF]/5 border border-[#458FFF]/10 p-5 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[380px] hover:border-[#458FFF]/30 transition-all"
        >
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#458FFF]/20 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Printer size={22} className="text-[#458FFF]" />
            </div>
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 leading-tight">
              Impresión<br />Gran Formato
            </h3>
            <p className="text-white/40 text-xs sm:text-sm leading-relaxed max-w-sm">
              Vinil, lona y materiales especiales con máquinas de hasta 160cm de ancho. Tintas UV de alta resistencia.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#458FFF] text-xs sm:text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
            Cotizar ahora <ArrowUpRight size={16} />
          </div>
          {/* Decorative */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#458FFF]/5 rounded-full blur-2xl" />
        </Link>

        {/* Service 2 — Large card (spans 2 cols) */}
        <Link
          href="/admin/corte-laser"
          className="col-span-2 row-span-2 group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFD700]/10 to-[#FFD700]/[0.02] border border-[#FFD700]/10 p-5 sm:p-8 flex flex-col justify-between min-h-[280px] sm:min-h-[380px] hover:border-[#FFD700]/30 transition-all"
        >
          <div>
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#FFD700]/15 flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
              <Scissors size={22} className="text-[#FFD700]" />
            </div>
            <h3 className="text-white text-xl sm:text-2xl md:text-3xl font-black mb-2 sm:mb-3 leading-tight">
              Corte<br />Láser
            </h3>
            <p className="text-white/40 text-xs sm:text-sm leading-relaxed max-w-sm">
              Corte y grabado de precisión en acrílico, madera, MDF y metales. Acabados profesionales garantizados.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[#FFD700] text-xs sm:text-sm font-semibold mt-4 group-hover:gap-3 transition-all">
            Cotizar ahora <ArrowUpRight size={16} />
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#FFD700]/5 rounded-full blur-2xl" />
        </Link>

        {/* Stats row — 4 small cards */}
        <div className="col-span-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
          <Zap size={18} className="text-[#458FFF] mb-3" />
          <div>
            <p className="text-white text-2xl sm:text-3xl font-black">160<span className="text-white/30 text-base">cm</span></p>
            <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">Ancho máximo</p>
          </div>
        </div>

        <div className="col-span-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
          <Award size={18} className="text-[#FFD700] mb-3" />
          <div>
            <p className="text-white text-2xl sm:text-3xl font-black">UV</p>
            <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">Tintas premium</p>
          </div>
        </div>

        <div className="col-span-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
          <Clock size={18} className="text-[#A855F7] mb-3" />
          <div>
            <p className="text-white text-2xl sm:text-3xl font-black">24<span className="text-white/30 text-base">hrs</span></p>
            <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">Entrega express</p>
          </div>
        </div>

        <div className="col-span-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-5 flex flex-col justify-between min-h-[120px] sm:min-h-[140px]">
          <Layers size={18} className="text-emerald-400 mb-3" />
          <div>
            <p className="text-white text-2xl sm:text-3xl font-black">8+</p>
            <p className="text-white/30 text-[10px] sm:text-xs mt-0.5">Materiales</p>
          </div>
        </div>

        {/* CTA Banner — full width */}
        <Link
          href="/catalogo"
          className="col-span-2 md:col-span-4 group relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#458FFF]/10 via-[#A855F7]/10 to-[#FFD700]/10 border border-white/[0.06] p-5 sm:p-8 flex items-center justify-between hover:border-white/15 transition-all"
        >
          <div>
            <p className="text-white font-black text-lg sm:text-2xl mb-1">Explora nuestro catálogo</p>
            <p className="text-white/35 text-xs sm:text-sm">Trofeos, alcancías, señalética, exhibidores y más productos listos para pedido.</p>
          </div>
          <div className="shrink-0 ml-4 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#458FFF] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
            <ArrowUpRight size={20} />
          </div>
        </Link>
      </div>
    </section>
  );
}
