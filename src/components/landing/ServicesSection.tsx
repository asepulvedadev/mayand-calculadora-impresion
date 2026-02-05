'use client';

import Link from 'next/link';
import { Printer, Scissors, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: Printer,
    title: 'Impresión Gran Formato',
    description: 'Impresión en vinil, lona y materiales especiales con máquinas de hasta 160cm de ancho y 360cm de largo. Tintas UV de alta resistencia y colores vibrantes.',
    href: '/calculadora',
    color: '#458FFF'
  },
  {
    icon: Scissors,
    title: 'Corte Láser',
    description: 'Corte y grabado de precisión en acrílico, madera, MDF y metales para señalética y elementos arquitectónicos. Acabados profesionales garantizados.',
    href: '/corte-laser',
    color: '#FFD700'
  }
];

export function ServicesSection() {
  return (
    <section id="servicios" className="max-w-[1300px] mx-auto px-6 py-32">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
        <div className="flex flex-col gap-4">
          <h2 className="text-white text-4xl md:text-5xl font-black tracking-tight">
            Soluciones Especializadas
          </h2>
          <div className="h-2 w-32 bg-[#458FFF] rounded-full"></div>
        </div>
        <p className="text-white/60 max-w-md text-lg">
          Transformamos materiales rígidos y flexibles en herramientas de comunicación visual potentes y duraderas para tu negocio.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <Link
            key={index}
            href={service.href}
            className="group flex flex-col gap-6 p-10 rounded-3xl border border-white/5 bg-[#1a1d2e]/40 hover:bg-[#1a1d2e]/60 transition-all hover:border-[#458FFF]/50 relative overflow-hidden"
          >
            {/* Background icon */}
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <service.icon className="w-24 h-24" />
            </div>
            
            {/* Icon */}
            <div 
              className="size-16 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-inner group-hover:scale-110"
              style={{ 
                backgroundColor: `${service.color}20`,
                color: service.color
              }}
            >
              <service.icon className="w-8 h-8" />
            </div>
            
            {/* Content */}
            <div className="flex flex-col gap-3 relative z-10">
              <h3 className="text-2xl font-bold text-white">{service.title}</h3>
              <p className="text-white/60 leading-relaxed text-lg">
                {service.description}
              </p>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center gap-2 text-[#FFD700] font-medium mt-4 group-hover:translate-x-2 transition-transform">
              <span>Ver precios y cotizar</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
