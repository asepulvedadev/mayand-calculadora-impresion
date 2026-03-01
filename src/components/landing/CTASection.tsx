'use client';

import { ArrowRight, MessageCircle } from 'lucide-react';

export function CTASection() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '8140076026';

  return (
    <section className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#458FFF]/15 via-[#A855F7]/10 to-[#FFD700]/10 border border-white/[0.06] p-8 sm:p-14 text-center">
        {/* Decorative */}
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-[#458FFF]/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-[#A855F7]/8 rounded-full blur-[80px]" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-5">
            ¿Listo para tu próximo proyecto?
          </h2>
          <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto">
            Cotiza hoy mismo tu publicidad exterior, señalética corporativa o servicio de corte láser especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#25D366] text-white text-sm font-bold rounded-xl hover:bg-[#22c55e] transition-all active:scale-95 shadow-lg shadow-[#25D366]/20"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
            <a
              href={`mailto:ventas@${domain}`}
              className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.06] border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-all active:scale-95"
            >
              Enviar Email
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
