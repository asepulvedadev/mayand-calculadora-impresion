'use client';

import { useState } from 'react';
import { Eye } from 'lucide-react';

const categories = ['Todo', 'Corte Láser', 'Lonas y Vinilos', 'Proyectos Especiales'];

const projects = [
  {
    id: 'PRINT-990',
    title: 'Publicidad Monumental',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEecFbsUeDStdI-tb4EAkU0iw6w73GSMOQVGfkWI-oSK4Ui0sANpJC-OxXWzmhNIM1WYQOXjpaEWWI7jeRYKhVElJAJkA7WN2lSXePosZoyLhcWxiFc0eCvt0TWukIM6Y-1Por3DRaeXTiAoO7b-gZl3NoR8LIFhsTPiGpboTd12lIHidDe4A0SDc-vSQ1PAXArats5O-tmELGMRfr7rXXkaoVzX52HVxdDwYFneLZWfiSn21dogN6Q_99w07N_xkHWNiB_UO1UQQ',
    size: 'lg:col-span-8',
    height: 'min-h-[500px]',
    description: 'Instalación de lona microperforada de alta resistencia para fachada corporativa.'
  },
  {
    id: 'LSR-102',
    title: 'Patrones Geométricos',
    category: 'Corte Lásico',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVUpd8zPnt3HjEqTFtEqZQlHJk4Gp5qU06r0Jgg3OqxIbYxiOBArm3uL9wYbKIenT_xXBSxdFNaDPdbwNF-OtQANZDZWOrwxbUtZn6rbKZmIqN3uGI_B9IS6fclKXSpvd70R34Aw4EpQo2z1vVouxJSwHsCks9rIfzV-CAXa2ClTZSoiA9t56M5VEXvOpaCos4cbGjyeB09AFugRKVjOOZS5PQ-Kf7qNgFviShg0PTfVEWIY0P1E2dpFbs2G-vVJx6euGqBrridFE',
    size: 'lg:col-span-4',
    height: 'min-h-[500px]',
    description: 'Celosía en madera industrial para división de espacios interiores.'
  },
  {
    id: 'SP-304',
    title: 'Grabado Acrílico',
    category: 'Proyectos Especiales',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe5LjNsRm4tROM-r8CZuDgfVNSjJQ1sxRrGXsBdip_BAkT7Zgo9s5cT51cjat1F58vC0rkN2gH5ofEqT4wzVnMTBe9LfUeTiVAzbL4VcK9azsMFf0mp60sTPsj9QW8h4nyBCzZJ16-ViJ_E2NYFffs7UMuMopD048FgOpuXE1DkgplHoq4AhK4YnWScWWMsH-InwjikYLOLXt3YtXUvXp7Bnp5zGblMv2HCgnn39H-BjWgNhmTycxQib4i1ydt2oUBzoHBXgfGZLU',
    size: 'lg:col-span-4',
    height: 'min-h-[450px]',
    description: 'Detalle de grabado láser sobre acrílico cristal de 10mm.'
  },
  {
    id: 'PRINT-882',
    title: 'Gráficos de Exhibición',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBOowvFF8YwwzPWnRgKAg-8m3WNuLFsXFC710JL6cG25Ipiiz0qmopsYslQy4vbsnx85YeoQoIMF0VPnE_lGwhzqCH4SLthtBkTggOeMs9hbRF2QzpD8bdSdaYXQ88W_HadbJlv7mUySffECmL3VE7JZMaji9jK7JFGYf3PC7nBV-PNIhXrFkcj0WP1KQjAY94koPDUmBBe0uaxxytPd4tXaAtKcW_rEfhirdB-jrhbJt3PsJZziUH2pNRDCnBDYjXjBKmYexuwZ3c',
    size: 'lg:col-span-4',
    height: 'min-h-[450px]',
    description: 'Impresión en lona frontlit para eventos de gran concurrencia.'
  },
  {
    id: 'VINYL-201',
    title: 'Rotulación Vehicular',
    category: 'Lonas y Vinilos',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-TskCO92k_W92_qW7SYmaou8eNINSqwKjvles-uU5aAP1fQ8-cOEahOT4U1RIF9gNYiaSdPi9sc1p7QoxMF5gPtx4PD4slCJogveYxBUno61AGx9KMsm2yGPZT8yZWQwLq-AFz2_Gx9SQcoqCczcVMPWNc6Cf_fsgfFf_s7a3RyQPl-zFFBlfNVQ8qXQDcNRXCnJKvn5uXt0F6K2Xe_Yn-l5JXtHsHqHGGUY7YVMgCZXToRH9cziHCJPs2DO67IM9eol-ih_cUks',
    size: 'lg:col-span-4',
    height: 'min-h-[450px]',
    description: 'Vinil fundido de alta adherencia para flotas comerciales.'
  }
];

export function PortfolioSection() {
  const [activeCategory, setActiveCategory] = useState('Todo');

  const filteredProjects = activeCategory === 'Todo' 
    ? projects 
    : projects.filter(p => p.category === activeCategory);

  return (
    <section id="portafolio" className="max-w-[1400px] mx-auto px-6 py-24">
      {/* Header */}
      <div className="mb-12 border-l-8 border-[#458FFF] pl-8">
        <div className="flex flex-col gap-2">
          <span className="text-[#FFD700] font-bold tracking-[0.3em] uppercase text-sm">
            Catálogo Industrial
          </span>
          <h2 className="text-white text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase">
            Portafolio de <br/>Proyectos
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mt-4 font-medium leading-relaxed">
            Especialistas en impresión de gran formato y corte láser de alta precisión. 
            Transformamos materiales industriales en soluciones visuales de alto impacto.
          </p>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-1 mb-12 border-b border-white/10 pb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`flex h-12 cursor-pointer items-center justify-center px-6 text-xs font-bold uppercase tracking-widest transition-all rounded-lg ${
              activeCategory === category
                ? 'bg-[#458FFF] text-white'
                : 'bg-transparent text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-1">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className={`${project.size} ${project.height} group relative overflow-hidden bg-white/5 border border-white/10 min-h-[400px]`}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url("${project.image}")` }}
            />
            
            {/* ID Badge */}
            <div className="absolute top-0 left-0 p-6 bg-[#110363]/90 backdrop-blur-sm">
              <span className="text-[#FFD700] text-[10px] font-bold tracking-widest uppercase">
                {project.id}
              </span>
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-[#110363]/0 group-hover:bg-[#110363]/60 transition-all duration-300 flex flex-col justify-end p-8">
              <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                <span className="bg-[#458FFF] text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest inline-block mb-3">
                  {project.category}
                </span>
                <h3 className="text-white text-2xl md:text-3xl font-black uppercase mt-1">
                  {project.title}
                </h3>
                <p className="text-white/80 text-sm mt-2 max-w-md">
                  {project.description}
                </p>
                <button className="flex items-center gap-2 text-[#FFD700] mt-4 text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors">
                  <Eye className="w-4 h-4" />
                  Ver Proyecto
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
