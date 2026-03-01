'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, ArrowRight } from 'lucide-react';
import { getProductImageUrl } from '@/lib/storage';

interface Project {
  id: string;
  title: string;
  image: string;
  span: string;
}

const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'PRINT-990',
    title: 'Publicidad Monumental',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEecFbsUeDStdI-tb4EAkU0iw6w73GSMOQVGfkWI-oSK4Ui0sANpJC-OxXWzmhNIM1WYQOXjpaEWWI7jeRYKhVElJAJkA7WN2lSXePosZoyLhcWxiFc0eCvt0TWukIM6Y-1Por3DRaeXTiAoO7b-gZl3NoR8LIFhsTPiGpboTd12lIHidDe4A0SDc-vSQ1PAXArats5O-tmELGMRfr7rXXkaoVzX52HVxdDwYFneLZWfiSn21dogN6Q_99w07N_xkHWNiB_UO1UQQ',
    span: 'col-span-2 row-span-2',
  },
  {
    id: 'LSR-102',
    title: 'Patrones Geométricos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVUpd8zPnt3HjEqTFtEqZQlHJk4Gp5qU06r0Jgg3OqxIbYxiOBArm3uL9wYbKIenT_xXBSxdFNaDPdbwNF-OtQANZDZWOrwxbUtZn6rbKZmIqN3uGI_B9IS6fclKXSpvd70R34Aw4EpQo2z1vVouxJSwHsCks9rIfzV-CAXa2ClTZSoiA9t56M5VEXvOpaCos4cbGjyeB09AFugRKVjOOZS5PQ-Kf7qNgFviShg0PTfVEWIY0P1E2dpFbs2G-vVJx6euGqBrridFE',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'SP-304',
    title: 'Grabado Acrílico',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5LjNsRm4tROM-r8CZuDgfVNSjJQ1sxRrGXsBdip_BAkT7Zgo9s5cT51cjat1F58vC0rkN2gH5ofEqT4wzVnMTBe9LfUeTiVAzbL4VcK9azsMFf0mp60sTPsj9QW8h4nyBCzZJ16-ViJ_E2NYFffs7UMuMopD048FgOpuXE1DkgplHoq4AhK4YnWScWWMsH-InwjikYLOLXt3YtXUvXp7Bnp5zGblMv2HCgnn39H-BjWgNhmTycxQib4i1ydt2oUBzoHBXgfGZLU',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'PRINT-882',
    title: 'Gráficos de Exhibición',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOowvFF8YwwzPWnRgKAg-8m3WNuLFsXFC710JL6cG25Ipiiz0qmopsYslQy4vbsnx85YeoQoIMF0VPnE_lGwhzqCH4SLthtBkTggOeMs9hbRF2QzpD8bdSdaYXQ88W_HadbJlv7mUySffECmL3VE7JZMaji9jK7JFGYf3PC7nBV-PNIhXrFkcj0WP1KQjAY94koPDUmBBe0uaxxytPd4tXaAtKcW_rEfhirdB-jrhbJt3PsJZziUH2pNRDCnBDYjXjBKmYexuwZ3c',
    span: 'col-span-1 row-span-1',
  },
  {
    id: 'VINYL-201',
    title: 'Rotulación Vehicular',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TskCO92k_W92_qW7SYmaou8eNINSqwKjvles-uU5aAP1fQ8-cOEahOT4U1RIF9gNYiaSdPi9sc1p7QoxMF5gPtx4PD4slCJogveYxBUno61AGx9KMsm2yGPZT8yZWQwLq-AFz2_Gx9SQcoqCczcVMPWNc6Cf_fsgfFf_s7a3RyQPl-zFFBlfNVQ8qXQDcNRXCnJKvn5uXt0F6K2Xe_Yn-l5JXtHsHqHGGUY7YVMgCZXToRH9cziHCJPs2DO67IM9eol-ih_cUks',
    span: 'col-span-1 row-span-1',
  },
];

const SPAN_MAP: Record<number, string> = {
  0: 'col-span-2 row-span-2',
  1: 'col-span-1 row-span-1',
  2: 'col-span-1 row-span-1',
  3: 'col-span-1 row-span-1',
  4: 'col-span-1 row-span-1',
};

export function PortfolioSection() {
  const [projects, setProjects] = useState<Project[]>(FALLBACK_PROJECTS);

  useEffect(() => {
    fetch('/api/admin/landing?section=portfolio')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.sections?.length) {
          const active = data.sections.filter((s: { is_active: boolean }) => s.is_active);
          if (active.length > 0) {
            setProjects(active.map((s: { subtitle: string; title: string; image_url: string; sort_order: number }, i: number) => ({
              id: s.subtitle || `PRJ-${i}`,
              title: s.title || '',
              image: getProductImageUrl(s.image_url),
              span: SPAN_MAP[i] || 'col-span-1 row-span-1',
            })));
          }
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="relative w-full h-[calc(100svh-56px)] sm:h-[calc(100svh-64px)] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-3 sm:pb-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-white text-xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.1]">
            Portafolio
          </h2>
          <Link
            href="/catalogo"
            className="group flex items-center gap-1.5 text-[#458FFF] text-xs sm:text-sm font-semibold shrink-0 hover:gap-2.5 transition-all"
          >
            Ver más
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Image grid */}
      <div className="flex-1 min-h-0 px-4 sm:px-6 lg:px-8 pb-4 sm:pb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 h-full auto-rows-fr">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`${project.span} group relative overflow-hidden rounded-xl sm:rounded-2xl cursor-pointer`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url("${project.image}")` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* ID tag */}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                <span className="px-1.5 py-0.5 bg-black/40 backdrop-blur-sm rounded text-[8px] sm:text-[10px] text-[#FFD700] font-bold tracking-wider uppercase">
                  {project.id}
                </span>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-[#080422]/0 group-hover:bg-[#080422]/40 transition-all duration-300" />

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-2.5 sm:p-4">
                <h3 className="text-white font-bold text-xs sm:text-sm leading-tight mb-0.5">
                  {project.title}
                </h3>
                <div className="flex items-center gap-1.5 text-[#458FFF] text-[10px] sm:text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Eye size={11} />
                  Ver proyecto
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
