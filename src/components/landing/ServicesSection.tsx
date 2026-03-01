'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Zap, Award, Clock, Layers } from 'lucide-react';
import { getProductImageUrl } from '@/lib/storage';

interface ServiceData {
  image: string;
  title: string;
  subtitle: string;
  link: string;
  accentColor: string;
}

const FALLBACK_SERVICES: ServiceData[] = [
  {
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80',
    title: 'Impresión Gran Formato',
    subtitle: 'Cotizar',
    link: '/admin/calculadora',
    accentColor: '#458FFF',
  },
  {
    image: 'https://images.unsplash.com/photo-1565034946487-077786996e27?w=800&q=80',
    title: 'Corte Láser',
    subtitle: 'Cotizar',
    link: '/admin/corte-laser',
    accentColor: '#FFD700',
  },
];

export function ServicesSection() {
  const [services, setServices] = useState<ServiceData[]>(FALLBACK_SERVICES);

  useEffect(() => {
    fetch('/api/admin/landing?section=services')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.sections?.length) {
          const active = data.sections.filter((s: { is_active: boolean }) => s.is_active);
          if (active.length >= 2) {
            setServices(active.map((s: { image_url: string; title: string; subtitle: string; link_url: string; slot: string }) => ({
              image: getProductImageUrl(s.image_url),
              title: s.title || '',
              subtitle: s.subtitle || 'Cotizar',
              link: s.link_url || '#',
              accentColor: s.slot === 'service_laser' ? '#FFD700' : '#458FFF',
            })));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-[calc(100svh-56px)] sm:h-[calc(100svh-64px)] flex flex-col overflow-hidden">
      {/* Header — compact */}
      <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-4 sm:pb-6">
        <span className="text-[#458FFF] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-1.5 block">Nuestros servicios</span>
        <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.1]">
          Soluciones{' '}
          <span className="bg-gradient-to-r from-[#458FFF] to-[#A855F7] bg-clip-text text-transparent">Especializadas</span>
        </h2>
      </div>

      {/* Main grid */}
      <div className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 h-full">
          {/* Service 1 */}
          <Link
            href={services[0]?.link || '/admin/calculadora'}
            className="col-span-1 md:col-span-2 row-span-2 group relative overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <Image
              src={services[0]?.image || FALLBACK_SERVICES[0].image}
              alt={services[0]?.title || 'Impresión Gran Formato'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-[#458FFF]/10" />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-black mb-1 leading-tight">
                {services[0]?.title || 'Impresión Gran Formato'}
              </h3>
              <div className="flex items-center gap-2 text-[#458FFF] text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all">
                {services[0]?.subtitle || 'Cotizar'} <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Service 2 */}
          <Link
            href={services[1]?.link || '/admin/corte-laser'}
            className="col-span-1 md:col-span-2 row-span-2 group relative overflow-hidden rounded-2xl sm:rounded-3xl"
          >
            <Image
              src={services[1]?.image || FALLBACK_SERVICES[1].image}
              alt={services[1]?.title || 'Corte Láser'}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-[#FFD700]/10" />
            <div className="absolute inset-0 p-4 sm:p-6 flex flex-col justify-end">
              <h3 className="text-white text-lg sm:text-2xl md:text-3xl font-black mb-1 leading-tight">
                {services[1]?.title || 'Corte Láser'}
              </h3>
              <div className="flex items-center gap-2 text-[#FFD700] text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all">
                {services[1]?.subtitle || 'Cotizar'} <ArrowUpRight size={14} />
              </div>
            </div>
          </Link>

          {/* Stats row */}
          <div className="col-span-1 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-4 flex flex-col justify-between">
            <Zap size={16} className="text-[#458FFF]" />
            <div>
              <p className="text-white text-xl sm:text-2xl font-black">160<span className="text-white/30 text-xs">cm</span></p>
              <p className="text-white/30 text-[9px] sm:text-[10px]">Ancho máximo</p>
            </div>
          </div>

          <div className="col-span-1 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-4 flex flex-col justify-between">
            <Award size={16} className="text-[#FFD700]" />
            <div>
              <p className="text-white text-xl sm:text-2xl font-black">UV</p>
              <p className="text-white/30 text-[9px] sm:text-[10px]">Tintas premium</p>
            </div>
          </div>

          <div className="col-span-1 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-4 flex flex-col justify-between">
            <Clock size={16} className="text-[#A855F7]" />
            <div>
              <p className="text-white text-xl sm:text-2xl font-black">24<span className="text-white/30 text-xs">hrs</span></p>
              <p className="text-white/30 text-[9px] sm:text-[10px]">Entrega express</p>
            </div>
          </div>

          <div className="col-span-1 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] p-3 sm:p-4 flex flex-col justify-between">
            <Layers size={16} className="text-emerald-400" />
            <div>
              <p className="text-white text-xl sm:text-2xl font-black">8+</p>
              <p className="text-white/30 text-[9px] sm:text-[10px]">Materiales</p>
            </div>
          </div>

          {/* Catalog banner */}
          <Link
            href="/catalogo"
            className="col-span-2 md:col-span-4 group relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#458FFF]/10 via-[#A855F7]/10 to-[#FFD700]/10 border border-white/[0.06] px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:border-white/15 transition-all"
          >
            <p className="text-white font-black text-sm sm:text-lg">Explora nuestro catálogo</p>
            <div className="shrink-0 ml-3 w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-[#458FFF] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
              <ArrowUpRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
