'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react'
import { CircularProgress } from '@mui/material'
import { FilterList, ArrowBack } from '@mui/icons-material'
import { getProductImageUrl } from '@/lib/storage'

interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  category_id: string
  material_id: string
  dimensions: string
  thickness: string
  price: number
  price_wholesale?: number
  price_unit: string
  wholesale_min_quantity?: number
  image_url: string
  badge: string
  badge_color: string
  stock: number
  is_active: boolean
  is_featured: boolean
  category?: { name: string }
  material?: { name: string }
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])

  // Cargar datos desde Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/catalog/products?active=true'),
          fetch('/api/catalog/categories')
        ])

        const productsData = await productsRes.json()
        const categoriesData = await categoriesRes.json()

        if (productsData.products) {
          setProducts(productsData.products)
          // Extraer materiales únicos
          const uniqueMaterials = [...new Set(
            productsData.products
              .filter((p: Product) => p.material?.name)
              .map((p: Product) => p.material?.name)
          )] as string[]
          setMaterials(uniqueMaterials)
        }

        if (categoriesData.categories) {
          setCategories(categoriesData.categories)
        }
      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesMaterials = selectedMaterials.length === 0 || 
                           (product.material?.name && selectedMaterials.includes(product.material.name))
    return matchesCategory && matchesSearch && matchesMaterials
  })

  return (
    <div className="min-h-screen bg-[#110363]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0a0821]">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 text-[#458FFF]">
            <ArrowBack fontSize="large" />
            <span className="text-white font-semibold">Volver</span>
          </Link>
          <div className="flex items-center gap-3">
            <Image
              src="/LOGO_LIGHT.svg"
              alt="Mayand"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
            <ShoppingCart size={24} />
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 hidden md:flex flex-col border-r border-white/10 bg-[#0a0821]/50 p-6 gap-8 overflow-y-auto min-h-[calc(100vh-80px)]">
          {/* Buscador */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={20} />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:border-[#458FFF] transition-colors"
            />
          </div>

          {/* Categorías */}
          <div>
            <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Categorías</h3>
            <nav className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#458FFF]/20 text-[#458FFF]'
                    : 'text-white/70 hover:bg-white/10'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">apps</span>
                <span className="text-sm">Todo</span>
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-semibold transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-[#458FFF]/20 text-[#458FFF]'
                      : 'text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{category.icon}</span>
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Materiales */}
          {materials.length > 0 && (
            <div>
              <h3 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Materiales</h3>
              <div className="flex flex-wrap gap-2">
                {materials.map((material) => (
                  <button
                    key={material}
                    onClick={() => {
                      setSelectedMaterials(prev =>
                        prev.includes(material)
                          ? prev.filter(m => m !== material)
                          : [...prev, material]
                      );
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      selectedMaterials.includes(material)
                        ? 'bg-[#458FFF] text-white'
                        : 'bg-white/10 text-white/70 hover:bg-white/20'
                    }`}
                  >
                    {material}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-[#458FFF] to-[#110363] text-white">
            <p className="text-sm font-bold mb-2">¿Proyecto Especial?</p>
            <p className="text-xs opacity-90 mb-4">Cotiza diseños personalizados a medida.</p>
            <Link
              href="#contacto"
              className="block w-full py-2 bg-white text-[#458FFF] text-xs font-bold rounded-lg hover:bg-slate-100 transition-colors text-center"
            >
              Contactar
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          {/* Breadcrumbs & Title */}
          <div className="max-w-7xl mx-auto mb-10">
            <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
              <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
              <ChevronRight style={{ fontSize: 16 }} />
              <span className="text-[#FFD700] font-medium">Catálogo de Productos</span>
            </div>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-white text-4xl md:text-5xl font-black tracking-tight mb-2">
                  Catálogo de Productos
                </h1>
                <p className="text-white/60 text-lg">
                  Especialistas en corte láser e impresión de alta resolución.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm font-semibold text-white hover:bg-white/20 transition-colors">
                  <FilterList fontSize="small" />
                  Filtrar
                </button>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <CircularProgress className="animate-spin text-[#458FFF]" sx={{ fontSize: 48 }} />
            </div>
          )}

          {/* Product Grid */}
          {!loading && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-[#458FFF]/20 hover:border-[#458FFF]/30 transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-white/10">
                    <Image
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      width={400}
                      height={400}
                    />
                    <div className={`absolute top-4 right-4 px-3 py-1 ${product.badge_color ? '' : 'bg-[#458FFF]'} text-white text-[10px] font-bold rounded-full uppercase`}
                      style={{ backgroundColor: product.badge_color || '#458FFF' }}
                    >
                      {product.badge || product.category?.name || 'Producto'}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-white text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="space-y-2 border-t border-white/10 pt-4 mb-6">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Dimensiones</span>
                        <span className="text-white font-semibold">{product.dimensions}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Material</span>
                        <span className="text-white font-semibold">{product.material?.name || '-'}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">Calibre</span>
                        <span className="text-white font-semibold">{product.thickness || '-'}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-black text-[#FFD700]">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.price_unit && (
                          <span className="text-white/50 text-sm">{product.price_unit}</span>
                        )}
                        {product.price_wholesale && (
                          <div className="mt-1">
                            <span className="text-lg font-bold text-green-400">
                              ${product.price_wholesale.toLocaleString()}
                            </span>
                            <span className="text-white/40 text-xs ml-1">
                              x{product.wholesale_min_quantity || 10}+ pzs
                            </span>
                          </div>
                        )}
                      </div>
                      <button className="bg-[#458FFF] hover:bg-[#458FFF]/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                        <ShoppingCart size={18} />
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/60 text-lg">No se encontraron productos con los filtros seleccionados.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                  setSelectedMaterials([]);
                }}
                className="mt-4 text-[#458FFF] hover:text-[#458FFF]/80 font-semibold"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="max-w-7xl mx-auto mt-16 flex items-center justify-center gap-2">
              <button className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/50 hover:text-white hover:bg-white/20 transition-colors">
                <ChevronLeft style={{ fontSize: 20 }} />
              </button>
              <button className="w-10 h-10 rounded-lg bg-[#458FFF] text-white font-bold text-sm">1</button>
              <button className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 font-bold text-sm transition-colors">2</button>
              <button className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 font-bold text-sm transition-colors">3</button>
              <span className="px-2 text-white/40">...</span>
              <button className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white/70 hover:bg-white/20 font-bold text-sm transition-colors">12</button>
              <button className="p-2 rounded-lg bg-white/10 border border-white/20 text-white/50 hover:text-white hover:bg-white/20 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
