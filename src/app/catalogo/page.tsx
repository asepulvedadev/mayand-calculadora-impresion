'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Search, ChevronRight, ShoppingCart, X, SlidersHorizontal,
  ArrowLeft, Star, Eye, Package, Sparkles, Layers, Ruler,
  Palette, Grid3X3, Zap, Lightbulb, SignpostBig, LayoutGrid,
  Scissors, Box
} from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'

// ============================================
// ICON MAP — replaces Material Symbols with Lucide
// ============================================

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  precision_manufacturing: <Scissors size={16} />,
  print: <Palette size={16} />,
  lightbulb: <Lightbulb size={16} />,
  branding_watermark: <SignpostBig size={16} />,
  layers: <Layers size={16} />,
  apps: <Grid3X3 size={16} />,
  category: <LayoutGrid size={16} />,
  design_services: <Zap size={16} />,
}

function CategoryIcon({ icon, size = 16 }: { icon?: string; size?: number }) {
  if (!icon) return <Box size={size} />
  const mapped = CATEGORY_ICONS[icon]
  if (mapped) return mapped
  return <Box size={size} />
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
  image_url?: string
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
      <div className="aspect-[4/3] bg-white/5 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-white/5 rounded-full w-3/4 animate-pulse" />
        <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-white/5 rounded-full w-20 animate-pulse" />
          <div className="h-8 bg-white/5 rounded-xl w-20 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// PRODUCT DETAIL MODAL
// ============================================

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const [activeImage, setActiveImage] = useState(0)

  const allImages = [
    product.image_url,
    ...(product.images?.map(img => img.url) || [])
  ].filter(Boolean)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Mobile: full-screen sheet from bottom / Desktop: centered modal */}
      <div
        className="absolute inset-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-3xl sm:max-h-[85vh] sm:rounded-2xl overflow-y-auto bg-[#0d0638] sm:border sm:border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="sticky top-0 right-0 z-10 float-right m-3 p-2.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-white/20 text-white transition-colors"
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div className="relative bg-gradient-to-b from-white/5 to-transparent">
          <div className="aspect-square sm:aspect-[16/10] overflow-hidden">
            <Image
              src={getProductImageUrl(allImages[activeImage])}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 p-3 justify-center bg-black/20">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-[#458FFF] shadow-lg shadow-[#458FFF]/30'
                      : 'border-white/10 opacity-50 hover:opacity-100'
                  }`}
                >
                  <Image src={getProductImageUrl(img)} alt="" width={48} height={48} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Category & Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {product.category?.name && (
              <span
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{
                  backgroundColor: (product.category.color || '#458FFF') + '20',
                  color: product.category.color || '#458FFF'
                }}
              >
                {product.category.name}
              </span>
            )}
            {product.badge && (
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white" style={{ backgroundColor: product.badge_color || '#458FFF' }}>
                {product.badge}
              </span>
            )}
            {product.is_featured && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-400">
                <Star size={10} fill="currentColor" /> Destacado
              </span>
            )}
          </div>

          <h2 className="text-white text-xl sm:text-2xl font-bold leading-tight">{product.name}</h2>
          <p className="text-white/50 text-sm leading-relaxed">{product.description}</p>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map(tag => (
                <span
                  key={tag.slug}
                  className="px-2 py-0.5 rounded text-[10px] font-medium"
                  style={{ backgroundColor: (tag.color || '#6B7280') + '20', color: tag.color || '#6B7280' }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Dimensiones</span>
              <p className="text-white font-semibold text-sm mt-0.5">{product.dimensions}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Material</span>
              <p className="text-white font-semibold text-sm mt-0.5">{product.material?.name || '-'}</p>
            </div>
            {product.thickness && (
              <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                <span className="text-white/30 text-[10px] uppercase tracking-wider">Grosor</span>
                <p className="text-white font-semibold text-sm mt-0.5">{product.thickness}</p>
              </div>
            )}
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              <span className="text-white/30 text-[10px] uppercase tracking-wider">Disponibilidad</span>
              <p className="text-sm mt-0.5">
                {product.stock === -1 ? (
                  <span className="text-emerald-400 font-semibold">Sobre pedido</span>
                ) : product.stock > 0 ? (
                  <span className="text-emerald-400 font-semibold">{product.stock} uds</span>
                ) : (
                  <span className="text-red-400 font-semibold">Agotado</span>
                )}
              </p>
            </div>
          </div>

          {/* Price + CTA — sticky on mobile */}
          <div className="sticky bottom-0 -mx-5 sm:-mx-6 px-5 sm:px-6 py-4 bg-[#0d0638]/95 backdrop-blur-sm border-t border-white/[0.06]">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl sm:text-3xl font-black text-[#FFD700]">
                    ${Number(product.price).toLocaleString()}
                  </span>
                  {product.price_unit && <span className="text-white/30 text-xs">/{product.price_unit}</span>}
                </div>
                {product.price_wholesale && (
                  <p className="text-emerald-400 text-xs mt-0.5">
                    ${Number(product.price_wholesale).toLocaleString()} mayoreo ({product.wholesale_min_quantity || 10}+ pzs)
                  </p>
                )}
              </div>
              <button className="flex items-center gap-2 bg-[#458FFF] hover:bg-[#3a7de6] text-white px-5 py-3 rounded-xl font-bold text-sm transition-all active:scale-95 shrink-0">
                <ShoppingCart size={16} />
                Cotizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================
// FILTER DRAWER (MOBILE)
// ============================================

function FilterDrawer({
  open,
  onClose,
  categories,
  materials,
  selectedCategory,
  selectedMaterials,
  searchQuery,
  onCategoryChange,
  onMaterialToggle,
  onSearchChange,
  onClearFilters,
  productCount,
}: {
  open: boolean
  onClose: () => void
  categories: Category[]
  materials: string[]
  selectedCategory: string
  selectedMaterials: string[]
  searchQuery: string
  onCategoryChange: (id: string) => void
  onMaterialToggle: (name: string) => void
  onSearchChange: (q: string) => void
  onClearFilters: () => void
  productCount: number
}) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-[#0d0638] border-t border-white/10 p-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />

        <div className="flex items-center justify-between mb-5">
          <h3 className="text-white text-base font-bold">Filtros</h3>
          <button onClick={onClearFilters} className="text-[#458FFF] text-xs font-medium">Limpiar</button>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#458FFF]/50 transition-all"
          />
        </div>

        {/* Categories */}
        <div className="mb-5">
          <h4 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-2.5">Categorías</h4>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onCategoryChange('all')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#080422]'
                  : 'bg-white/[0.06] text-white/50'
              }`}
            >
              <Grid3X3 size={13} />
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  selectedCategory === cat.id ? 'text-white' : 'bg-white/[0.06] text-white/50'
                }`}
                style={selectedCategory === cat.id ? { backgroundColor: cat.color } : {}}
              >
                <CategoryIcon icon={cat.icon} size={13} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Materials */}
        {materials.length > 0 && (
          <div className="mb-5">
            <h4 className="text-white/40 text-[11px] font-bold uppercase tracking-widest mb-2.5">Materiales</h4>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <button
                  key={material}
                  onClick={() => onMaterialToggle(material)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    selectedMaterials.includes(material)
                      ? 'bg-[#458FFF] text-white'
                      : 'bg-white/[0.06] text-white/50'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-xl bg-[#458FFF] text-white font-bold text-sm mt-2"
        >
          Ver {productCount} producto{productCount !== 1 ? 's' : ''}
        </button>
      </div>
    </div>
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
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)

  // Fetch data
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
  const activeFiltersCount = (selectedCategory !== 'all' ? 1 : 0) + selectedMaterials.length + (searchQuery ? 1 : 0)

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

  const selectedCategoryData = categories.find(c => c.id === selectedCategory)

  return (
    <div className="min-h-screen bg-[#080422]">
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#080422]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-2.5 sm:py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
              <span className="hidden sm:inline text-sm font-medium">Inicio</span>
            </Link>
            <div className="h-4 w-px bg-white/10 hidden sm:block" />
            <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={90} height={28} className="h-6 sm:h-7 w-auto" />
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Desktop search */}
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-64 bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#458FFF]/40 transition-all"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Mobile filter + search */}
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="md:hidden relative p-2 rounded-lg bg-white/[0.06] text-white/50"
            >
              <SlidersHorizontal size={16} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#458FFF] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            <button className="p-2 rounded-lg bg-white/[0.06] text-white/50">
              <ShoppingCart size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* ============ HERO — compact on mobile ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-[#458FFF]/8 rounded-full blur-[100px]" />
          <div className="absolute -bottom-10 right-1/4 w-48 sm:w-72 h-48 sm:h-72 bg-[#A855F7]/8 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 pt-6 sm:pt-10 pb-4 sm:pb-8">
          {/* Breadcrumbs — hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 text-white/30 text-xs mb-4">
            <Link href="/" className="hover:text-white/60 transition-colors">Inicio</Link>
            <ChevronRight size={11} />
            <span className="text-[#458FFF] font-medium">Catálogo</span>
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={13} className="text-[#FFD700] shrink-0" />
                <span className="text-[#FFD700] text-[10px] sm:text-xs font-semibold uppercase tracking-widest">Catálogo Mayand</span>
              </div>
              <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.1] mb-2 sm:mb-3">
                Productos de{' '}
                <span className="bg-gradient-to-r from-[#458FFF] to-[#A855F7] bg-clip-text text-transparent">
                  Alta Calidad
                </span>
              </h1>
              <p className="text-white/35 text-xs sm:text-sm leading-relaxed max-w-lg">
                Corte láser, impresión UV, señalética y más.
              </p>
            </div>

            {/* Stats — inline on mobile, stacked on desktop */}
            <div className="hidden sm:flex items-center gap-5 shrink-0 mt-2">
              <div className="text-center">
                <div className="w-9 h-9 rounded-lg bg-[#458FFF]/10 flex items-center justify-center mx-auto mb-1">
                  <Package size={15} className="text-[#458FFF]" />
                </div>
                <p className="text-white font-bold text-sm">{products.length}</p>
                <p className="text-white/25 text-[10px]">Productos</p>
              </div>
              <div className="text-center">
                <div className="w-9 h-9 rounded-lg bg-[#A855F7]/10 flex items-center justify-center mx-auto mb-1">
                  <LayoutGrid size={15} className="text-[#A855F7]" />
                </div>
                <p className="text-white font-bold text-sm">{categories.length}</p>
                <p className="text-white/25 text-[10px]">Categorías</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CATEGORY PILLS — scrollable ============ */}
      <section className="border-b border-white/[0.06] bg-[#080422]/60 backdrop-blur-sm sticky top-[45px] sm:top-[53px] z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-1.5 sm:gap-2 py-2.5 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-white text-[#080422]'
                  : 'bg-white/[0.05] text-white/40 active:bg-white/[0.1]'
              }`}
            >
              <Grid3X3 size={14} />
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'text-white'
                    : 'bg-white/[0.05] text-white/40 active:bg-white/[0.1]'
                }`}
                style={selectedCategory === cat.id ? {
                  backgroundColor: cat.color,
                  boxShadow: `0 4px 16px ${cat.color}30`
                } : {}}
              >
                <CategoryIcon icon={cat.icon} size={14} />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURED ============ */}
      {selectedCategory === 'all' && !searchQuery && featuredProducts.length > 0 && !loading && (
        <section className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8 pb-2">
          <div className="flex items-center gap-2 mb-4">
            <Star size={15} className="text-[#FFD700]" fill="#FFD700" />
            <h2 className="text-white text-sm sm:text-base font-bold">Destacados</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {featuredProducts.slice(0, 4).map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group shrink-0 w-[260px] sm:w-[280px] overflow-hidden rounded-xl border border-[#FFD700]/15 bg-gradient-to-br from-[#FFD700]/[0.04] to-transparent text-left active:scale-[0.98] transition-transform"
              >
                <div className="flex gap-3 p-3">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-lg overflow-hidden bg-white/5 shrink-0">
                    <Image
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      width={72}
                      height={72}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 py-0.5">
                    <p className="text-white font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-white/30 text-[11px] truncate">{product.category?.name}</p>
                    <p className="text-[#FFD700] font-black text-base mt-1.5">
                      ${Number(product.price).toLocaleString()}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============ ACTIVE FILTERS ============ */}
      {activeFiltersCount > 0 && (
        <div className="max-w-7xl mx-auto px-4 pt-4">
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            {selectedCategory !== 'all' && selectedCategoryData && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-white" style={{ backgroundColor: selectedCategoryData.color + '30' }}>
                {selectedCategoryData.name}
                <button onClick={() => setSelectedCategory('all')}><X size={11} /></button>
              </span>
            )}
            {selectedMaterials.map(mat => (
              <span key={mat} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-white bg-white/10">
                {mat}
                <button onClick={() => toggleMaterial(mat)}><X size={11} /></button>
              </span>
            ))}
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium text-white bg-white/10">
                &ldquo;{searchQuery}&rdquo;
                <button onClick={() => setSearchQuery('')}><X size={11} /></button>
              </span>
            )}
            <button onClick={clearFilters} className="text-[#458FFF] text-xs font-medium ml-1">Limpiar</button>
          </div>
        </div>
      )}

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 flex gap-8 pb-20">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-52 shrink-0 pt-8">
          <div className="sticky top-[110px] space-y-7">
            {materials.length > 0 && (
              <div>
                <h3 className="text-white/30 text-[10px] font-bold uppercase tracking-widest mb-2.5">Materiales</h3>
                <div className="space-y-0.5">
                  {materials.map((material) => (
                    <button
                      key={material}
                      onClick={() => toggleMaterial(material)}
                      className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-all text-left ${
                        selectedMaterials.includes(material)
                          ? 'bg-[#458FFF]/15 text-[#458FFF]'
                          : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded border-[1.5px] flex items-center justify-center shrink-0 transition-all ${
                        selectedMaterials.includes(material) ? 'border-[#458FFF] bg-[#458FFF]' : 'border-white/20'
                      }`}>
                        {selectedMaterials.includes(material) && (
                          <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="truncate">{material}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 rounded-xl bg-gradient-to-b from-[#458FFF]/8 to-transparent border border-[#458FFF]/10">
              <Zap size={18} className="text-[#458FFF] mb-2" />
              <p className="text-white font-bold text-sm mb-1">Proyecto especial</p>
              <p className="text-white/30 text-xs mb-3 leading-relaxed">Fabricamos cualquier diseño personalizado.</p>
              <Link href="/" className="flex items-center justify-center w-full py-2 bg-[#458FFF] text-white text-xs font-bold rounded-lg hover:bg-[#3a7de6] transition-colors">
                Cotizar
              </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1 pt-5 sm:pt-8">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <p className="text-white/25 text-xs sm:text-sm">
              {loading ? 'Cargando...' : (
                <>
                  <span className="text-white/60 font-semibold">{filteredProducts.length}</span>
                  {' '}producto{filteredProducts.length !== 1 ? 's' : ''}
                  {selectedCategory !== 'all' && selectedCategoryData && (
                    <> en <span className="font-medium" style={{ color: selectedCategoryData.color }}>{selectedCategoryData.name}</span></>
                  )}
                </>
              )}
            </p>
          </div>

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)}
            </div>
          )}

          {/* Products */}
          {!loading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  className="group text-left rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden active:scale-[0.98] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative aspect-square sm:aspect-[4/3] overflow-hidden bg-white/[0.02]">
                    <Image
                      src={getProductImageUrl(product.image_url)}
                      alt={product.name}
                      width={400}
                      height={400}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Badge */}
                    <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
                      {product.badge ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-white uppercase" style={{ backgroundColor: product.badge_color || '#458FFF' }}>
                          {product.badge}
                        </span>
                      ) : product.category?.name ? (
                        <span className="px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold uppercase text-white/90" style={{ backgroundColor: (product.category.color || '#458FFF') + 'CC' }}>
                          {product.category.name}
                        </span>
                      ) : <span />}

                      {product.is_featured && (
                        <span className="p-1 rounded-md bg-black/40 backdrop-blur-sm">
                          <Star size={10} className="text-[#FFD700]" fill="#FFD700" />
                        </span>
                      )}
                    </div>

                    {/* Hover overlay — desktop only */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex items-end justify-center pb-3">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/20 backdrop-blur-md text-white text-[11px] font-semibold">
                        <Eye size={12} /> Ver detalle
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 sm:p-4">
                    <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 truncate group-hover:text-[#458FFF] transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-white/30 text-[10px] sm:text-xs line-clamp-1 sm:line-clamp-2 mb-2 sm:mb-3">
                      {product.description}
                    </p>

                    {/* Specs — hidden on tiny mobile */}
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

                    {/* Price */}
                    <div className="flex items-end justify-between pt-2 sm:pt-3 border-t border-white/[0.05]">
                      <div>
                        <span className="text-base sm:text-xl font-black text-[#FFD700]">
                          ${Number(product.price).toLocaleString()}
                        </span>
                        {product.price_unit && (
                          <span className="text-white/20 text-[9px] sm:text-xs ml-0.5">/{product.price_unit}</span>
                        )}
                        {product.price_wholesale && (
                          <p className="text-emerald-400/60 text-[9px] sm:text-[11px] mt-0.5">
                            ${Number(product.price_wholesale).toLocaleString()} may.
                          </p>
                        )}
                      </div>
                      <span className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#458FFF]/10 text-[#458FFF] text-[11px] font-semibold group-hover:bg-[#458FFF] group-hover:text-white transition-all">
                        <ShoppingCart size={12} />
                        Cotizar
                      </span>
                    </div>
                  </div>
                </button>
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
        </main>
      </div>

      {/* ============ DRAWERS / MODALS ============ */}
      <FilterDrawer
        open={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        categories={categories}
        materials={materials}
        selectedCategory={selectedCategory}
        selectedMaterials={selectedMaterials}
        searchQuery={searchQuery}
        onCategoryChange={setSelectedCategory}
        onMaterialToggle={toggleMaterial}
        onSearchChange={setSearchQuery}
        onClearFilters={clearFilters}
        productCount={filteredProducts.length}
      />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
