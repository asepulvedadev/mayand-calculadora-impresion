'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';

const CATEGORIES = ['Todo', 'Corte Láser', 'Lonas y Vinilos', 'Especiales'];

const PROJECTS = [
  {
    id: 'PRINT-990',
    title: 'Publicidad Monumental',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEecFbsUeDStdI-tb4EAkU0iw6w73GSMOQVGfkWI-oSK4Ui0sANpJC-OxXWzmhNIM1WYQOXjpaEWWI7jeRYKhVElJAJkA7WN2lSXePosZoyLhcWxiFc0eCvt0TWukIM6Y-1Por3DRaeXTiAoO7b-gZl3NoR8LIFhsTPiGpboTd12lIHidDe4A0SDc-vSQ1PAXArats5O-tmELGMRfr7rXXkaoVzX52HVxdDwYFneLZWfiSn21dogN6Q_99w07N_xkHWNiB_UO1UQQ',
    span: 'col-span-2 row-span-2',
    desc: 'Lona microperforada de alta resistencia para fachada corporativa.'
  },
  {
    id: 'LSR-102',
    title: 'Patrones Geométricos',
    category: 'Corte Láser',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVUpd8zPnt3HjEqTFtEqZQlHJk4Gp5qU06r0Jgg3OqxIbYxiOBArm3uL9wYbKIenT_xXBSxdFNaDPdbwNF-OtQANZDZWOrwxbUtZn6rbKZmIqN3uGI_B9IS6fclKXSpvd70R34Aw4EpQo2z1vVouxJSwHsCks9rIfzV-CAXa2ClTZSoiA9t56M5VEXvOpaCos4cbGjyeB09AFugRKVjOOZS5PQ-Kf7qNgFviShg0PTfVEWIY0P1E2dpFbs2G-vVJx6euGqBrridFE',
    span: 'col-span-1 row-span-1',
    desc: 'Celosía en madera industrial para interiores.'
  },
  {
    id: 'SP-304',
    title: 'Grabado Acrílico',
    category: 'Especiales',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5LjNsRm4tROM-r8CZuDgfVNSjJQ1sxRrGXsBdip_BAkT7Zgo9s5cT51cjat1F58vC0rkN2gH5ofEqT4wzVnMTBe9LfUeTiVAzbL4VcK9azsMFf0mp60sTPsj9QW8h4nyBCzZJ16-ViJ_E2NYFffs7UMuMopD048FgOpuXE1DkgplHoq4AhK4YnWScWWMsH-InwjikYLOLXt3YtXUvXp7Bnp5zGblMv2HCgnn39H-BjWgNhmTycxQib4i1ydt2oUBzoHBXgfGZLU',
    span: 'col-span-1 row-span-1',
    desc: 'Grabado láser sobre acrílico cristal de 10mm.'
  },
  {
    id: 'PRINT-882',
    title: 'Gráficos de Exhibición',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOowvFF8YwwzPWnRgKAg-8m3WNuLFsXFC710JL6cG25Ipiiz0qmopsYslQy4vbsnx85YeoQoIMF0VPnE_lGwhzqCH4SLthtBkTggOeMs9hbRF2QzpD8bdSdaYXQ88W_HadbJlv7mUySffECmL3VE7JZMaji9jK7JFGYf3PC7nBV-PNIhXrFkcj0WP1KQjAY94koPDUmBBe0uaxxytPd4tXaAtKcW_rEfhirdB-jrhbJt3PsJZziUH2pNRDCnBDYjXjBKmYexuwZ3c',
    span: 'col-span-1 row-span-1',
    desc: 'Lona frontlit para eventos de gran concurrencia.'
  },
  {
    id: 'VINYL-201',
    title: 'Rotulación Vehicular',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TskCO92k_W92_qW7SYmaou8eNINSqwKjvles-uU5aAP1fQ8-cOEahOT4U1RIF9gNYiaSdPi9sc1p7QoxMF5gPtx4PD4slCJogveYxBUno61AGx9KMsm2yGPZT8yZWQwLq-AFz2_Gx9SQcoqCczcVMPWNc6Cf_fsgfFf_s7a3RyQPl-zFFBlfNVQ8qXQDcNRXCnJKvn5uXt0F6K2Xe_Yn-l5JXtHsHqHGGUY7YVMgCZXToRH9cziHCJPs2DO67IM9eol-ih_cUks',
    span: 'col-span-1 row-span-1',
    desc: 'Vinil fundido de alta adherencia para flotas.'
  },
];

export function PortfolioSection() {
  const [active, setActive] = useState('Todo');

  const filtered = active === 'Todo' ? PROJECTS : PROJECTS.filter(p => p.category === active);

  return (
    <section id="portafolio" className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <span className="text-[#FFD700] text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-2 block">Proyectos</span>
        <h2 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-4 sm:mb-6">
          Portafolio
        </h2>
        <p className="text-white/35 text-xs sm:text-sm max-w-lg leading-relaxed">
          Impresión de gran formato y corte láser de alta precisión. Transformamos materiales en soluciones visuales de impacto.
        </p>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 mb-6 sm:mb-8 overflow-x-auto no-scrollbar pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`shrink-0 px-3.5 sm:px-5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
              active === cat
                ? 'bg-[#458FFF] text-white'
                : 'bg-white/[0.04] text-white/40 hover:bg-white/[0.08] active:bg-white/[0.1]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid — bento-style on desktop, stacked on mobile */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px]">
        {filtered.map((project) => (
          <div
            key={project.id}
            className={`${project.span} group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer`}
          >
            {/* Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url("${project.image}")` }}
            />

            {/* Always-visible gradient at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            {/* ID tag */}
            <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3">
              <span className="px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded text-[9px] sm:text-[10px] text-[#FFD700] font-bold tracking-wider uppercase">
                {project.id}
              </span>
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-[#080422]/0 group-hover:bg-[#080422]/50 transition-all duration-300" />

            {/* Info — always visible at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
              <h3 className="text-white font-bold text-xs sm:text-sm md:text-base leading-tight mb-0.5">
                {project.title}
              </h3>
              <p className="text-white/50 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-2">
                {project.desc}
              </p>

              {/* Hover detail */}
              <div className="flex items-center gap-1.5 text-[#458FFF] text-[10px] sm:text-xs font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Eye size={12} />
                Ver proyecto
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
