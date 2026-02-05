'use client';

export function CTASection() {
  const domain = process.env.NEXT_PUBLIC_DOMAIN || 'mayandmty.com';

  return (
    <section className="bg-[#110363] py-24 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10 pointer-events-none industrial-pattern"></div>
      <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center flex flex-col items-center gap-10">
        <h2 className="text-white text-5xl md:text-6xl font-black tracking-tight max-w-[900px]">
          ¿Listo para llevar tu marca al siguiente nivel?
        </h2>
        <p className="text-white/80 text-xl max-w-[700px] font-medium">
          Cotiza hoy mismo tus proyectos de publicidad exterior, señalética corporativa o servicios de corte láser especializado.
        </p>
        <div className="flex flex-col sm:flex-row gap-6">
          <a 
            href={`mailto:ventas@${domain}`}
            className="bg-white text-[#110363] px-12 py-5 rounded-xl font-bold text-xl hover:bg-gray-100 transition-all shadow-2xl hover:scale-105"
          >
            Hablar con un Experto
          </a>
          <a 
            href="#servicios"
            className="bg-transparent border-2 border-white/40 text-white px-12 py-5 rounded-xl font-bold text-xl hover:bg-white/10 transition-all"
          >
            Ver Servicios
          </a>
        </div>
      </div>
    </section>
  );
}
