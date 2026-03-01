'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, X, Star, Layers, Ruler,
  Grid3X3, Zap, Lightbulb, SignpostBig, LayoutGrid,
  Scissors, Box, Palette, ArrowLeft, ShoppingCart, ArrowRight, Check
} from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'
import { CartButton } from '@/components/cart/CartModal'
import { useCart } from '@/lib/cart/CartContext'

// ============================================
// ICON MAP
// ============================================

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  precision_manufacturing: <Scissors size={14} />,
  print: <Palette size={14} />,
  lightbulb: <Lightbulb size={14} />,
  branding_watermark: <SignpostBig size={14} />,
  layers: <Layers size={14} />,
  apps: <Grid3X3 size={14} />,
  category: <LayoutGrid size={14} />,
  design_services: <Zap size={14} />,
}

function CategoryIcon({ icon, size = 14 }: { icon?: string; size?: number }) {
  if (!icon) return <Box size={size} />
  return (CATEGORY_ICONS[icon] || <Box size={size} />)
}

// ============================================
// TYPES
// ============================================

interface Category {
  id: string
  name: string
  slug: string
  icon: string
  color: string
  sort_order: number
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
  views: number
  category?: { name: string; color?: string; icon?: string }
  material?: { name: string }
  images?: { url: string; alt?: string }[]
  tags?: { name: string; color?: string; slug: string }[]
}

// ============================================
// SKELETON
// ============================================

function ProductSkeleton() {
  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
      <div className="aspect-square bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
        <div className="h-6 bg-white/5 rounded-full w-20 animate-pulse" />
      </div>
    </div>
  )
}

// ============================================
// ADD TO CART BUTTON (inline in product card)
// ============================================

function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        addItem({
          id: product.id,
          name: product.name,
          price: Number(product.price),
          price_unit: product.price_unit,
          image_url: product.image_url,
          category_name: product.category?.name,
          category_color: product.category?.color,
        })
        setAdded(true)
        setTimeout(() => setAdded(false), 1200)
      }}
      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all active:scale-90 ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-[#458FFF]/10 text-[#458FFF] hover:bg-[#458FFF] hover:text-white'
      }`}
    >
      {added ? <Check size={14} /> : <ShoppingCart size={14} />}
    </button>
  )
}

// ============================================
// MAIN CATALOG PAGE
// ============================================

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([])
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/catalog/products?active=true'),
          fetch('/api/catalog/categories?active=true')
        ])

        const productsData = productsRes.ok ? await productsRes.json() : { products: [] }
        const categoriesData = categoriesRes.ok ? await categoriesRes.json() : { categories: [] }

        if (productsData.products) {
          setProducts(productsData.products)
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
    const matchesSearch = !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesMaterials = selectedMaterials.length === 0 ||
      (product.material?.name && selectedMaterials.includes(product.material.name))
    return matchesCategory && matchesSearch && matchesMaterials
  })

  const featuredProducts = products.filter(p => p.is_featured)

  const clearFilters = useCallback(() => {
    setSelectedCategory('all')
    setSearchQuery('')
    setSelectedMaterials([])
  }, [])

  const toggleMaterial = useCallback((name: string) => {
    setSelectedMaterials(prev =>
      prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]
    )
  }, [])

  const hasActiveFilters = selectedCategory !== 'all' || selectedMaterials.length > 0 || searchQuery

  return (
    <div className="min-h-screen bg-[#080422]">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#080422]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={90} height={28} className="h-6 sm:h-7 w-auto" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2.5 rounded-xl bg-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.1] transition-all"
            >
              <Search size={16} />
            </button>
            <CartButton />
          </div>
        </div>

        {/* Search bar — expandable */}
        {showSearch && (
          <div className="border-t border-white/[0.06] px-4 py-2.5">
            <div className="relative max-w-7xl mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="text"
                autoFocus
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/40 transition-all"
              />
              <button
                onClick={() => { setSearchQuery(''); setShowSearch(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ============ FILTERS — Categories + Materials ============ */}
      <section className="sticky top-[57px] sm:top-[65px] z-20 border-b border-white/[0.06] bg-[#080422]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#080422]'
                  : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'
              }`}
            >
              <Grid3X3 size={13} />
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'bg-white/[0.05] text-white/40 hover:bg-white/[0.08]'
                }`}
                style={selectedCategory === cat.id ? {
                  backgroundColor: cat.color,
                  boxShadow: `0 4px 16px ${cat.color}30`
                } : {}}
              >
                <CategoryIcon icon={cat.icon} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Materials */}
          {materials.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <span className="text-white/20 text-[10px] uppercase tracking-wider font-medium shrink-0 mr-1">Material:</span>
              {materials.map((material) => (
                <button
                  key={material}
                  onClick={() => toggleMaterial(material)}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                    selectedMaterials.includes(material)
                      ? 'bg-[#458FFF] text-white'
                      : 'bg-white/[0.04] text-white/35 hover:bg-white/[0.08]'
                  }`}
                >
                  {material}
                </button>
              ))}
              {hasActiveFilters && (
                <button onClick={clearFilters} className="shrink-0 text-[#458FFF] text-[11px] font-medium ml-2">
                  Limpiar
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 pb-20">
        {/* ============ FEATURED ============ */}
        {selectedCategory === 'all' && !searchQuery && featuredProducts.length > 0 && !loading && (
          <section className="pt-6 sm:pt-8 pb-4">
            <div className="flex items-center gap-2 mb-4 sm:mb-5">
              <Star size={14} className="text-[#FFD700]" fill="#FFD700" />
              <h2 className="text-white text-sm sm:text-base font-bold">Destacados</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {featuredProducts.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  href={`/catalogo/${product.id}`}
                  className="group overflow-hidden rounded-2xl border border-[#FFD700]/15 bg-gradient-to-br from-[#FFD700]/[0.06] to-transparent transition-all hover:border-[#FFD700]/30"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase" style={{ backgroundColor: product.badge_color || '#458FFF' }}>
                        {product.badge}
                      </span>
                    )}
                    <span className="absolute top-2 right-2 p-1 rounded-md bg-black/40 backdrop-blur-sm">
                      <Star size={10} className="text-[#FFD700]" fill="#FFD700" />
                    </span>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="text-white font-bold text-xs sm:text-sm truncate mb-0.5">{product.name}</p>
                    <p className="text-white/30 text-[10px] sm:text-xs truncate mb-2">{product.category?.name}</p>
                    <div className="flex items-end justify-between">
                      <span className="text-[#FFD700] font-black text-base sm:text-lg">
                        ${Number(product.price).toLocaleString()}
                      </span>
                      <span className="text-[#458FFF] text-[10px] font-semibold flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        Ver <ArrowRight size={10} />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ============ ALL PRODUCTS ============ */}
        <section className="pt-4 sm:pt-6">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <p className="text-white/25 text-xs sm:text-sm">
              {loading ? 'Cargando...' : (
                <>
                  <span className="text-white/60 font-semibold">{filteredProducts.length}</span>
                  {' '}producto{filteredProducts.length !== 1 ? 's' : ''}
                </>
              )}
            </p>
          </div>

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {/* Products grid */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/catalogo/${product.id}`}
                  className="group rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200"
                >
                  <div className="relative aspect-square overflow-hidden bg-white/[0.02]">
                    <Image
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                      {product.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold text-white uppercase" style={{ backgroundColor: product.badge_color || '#458FFF' }}>
                          {product.badge}
                        </span>
                      ) : product.category?.name ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase text-white/90" style={{ backgroundColor: (product.category.color || '#458FFF') + 'CC' }}>
                          {product.category.name}
                        </span>
                      ) : <span />}
                      {product.is_featured && (
                        <span className="p-1 rounded-md bg-black/40 backdrop-blur-sm">
                          <Star size={10} className="text-[#FFD700]" fill="#FFD700" />
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 sm:p-4">
                    <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5 truncate group-hover:text-[#458FFF] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-white/30 text-[10px] sm:text-xs line-clamp-1 mb-2">
                      {product.description}
                    </p>

                    <div className="hidden sm:flex items-center gap-2 mb-3 text-[10px] text-white/25">
                      {product.material?.name && (
                        <span className="flex items-center gap-0.5">
                          <Layers size={10} />
                          {product.material.name}
                        </span>
                      )}
                      {product.dimensions && (
                        <span className="flex items-center gap-0.5">
                          <Ruler size={10} />
                          {product.dimensions}
                        </span>
                      )}
                    </div>

                    <div className="flex items-end justify-between pt-2 border-t border-white/[0.05]">
                      <div>
                        <span className="text-base sm:text-lg font-black text-[#FFD700]">
                          ${Number(product.price).toLocaleString()}
                        </span>
                        {product.price_unit && (
                          <span className="text-white/20 text-[9px] ml-0.5">/{product.price_unit}</span>
                        )}
                      </div>
                      <AddToCartButton product={product} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center">
              <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center mb-4">
                <Search size={22} className="text-white/15" />
              </div>
              <h3 className="text-white font-bold text-base mb-1.5">Sin resultados</h3>
              <p className="text-white/30 text-xs max-w-[250px] mb-5">
                No encontramos productos con esos filtros.
              </p>
              <button onClick={clearFilters} className="px-5 py-2 rounded-xl bg-[#458FFF] text-white text-xs font-semibold">
                Limpiar filtros
              </button>
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
