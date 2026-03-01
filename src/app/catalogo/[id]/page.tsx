'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, Star, Layers, Ruler, ShoppingCart,
  ChevronLeft, ChevronRight, ArrowRight, Package, Check
} from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'
import { useCart } from '@/lib/cart/CartContext'
import { useAuth } from '@/lib/hooks/useAuth'
import { CartButton } from '@/components/cart/CartModal'
import { buildProductWhatsAppUrl } from '@/lib/whatsapp'

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
  category?: { id: string; name: string; color?: string; icon?: string }
  material?: { name: string }
  images?: { url: string; alt?: string }[]
  tags?: { name: string; color?: string; slug: string }[]
}

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { user, profile } = useAuth()

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await fetch(`/api/catalog/products/${id}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.product) {
          setProduct(data.product)

          // Fetch related products from same category
          const relRes = await fetch(`/api/catalog/products?active=true&category=${data.product.category_id}`)
          if (relRes.ok) {
            const relData = await relRes.json()
            if (relData.products) {
              setRelated(relData.products.filter((p: Product) => p.id !== id).slice(0, 3))
            }
          }
        }
      } catch (error) {
        console.error('Error cargando producto:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080422] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-[#458FFF] rounded-full animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#080422] flex flex-col items-center justify-center text-center px-4">
        <Package size={40} className="text-white/15 mb-4" />
        <h1 className="text-white font-bold text-xl mb-2">Producto no encontrado</h1>
        <p className="text-white/30 text-sm mb-6">El producto que buscas no existe o fue removido.</p>
        <Link href="/catalogo" className="px-6 py-3 rounded-xl bg-[#458FFF] text-white font-bold text-sm">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const allImages = [
    product.image_url,
    ...(product.images?.map(img => img.url) || [])
  ].filter(Boolean)

  const whatsappUrl = buildProductWhatsAppUrl(
    {
      name: product.name,
      price: Number(product.price),
      price_unit: product.price_unit,
      category_name: product.category?.name,
      dimensions: product.dimensions,
      material_name: product.material?.name,
    },
    profile,
    user?.email,
  )

  return (
    <div className="min-h-screen bg-[#080422]">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-[#080422]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:py-4">
          <div className="flex items-center gap-3">
            <Link href="/catalogo" className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <Image src="/LOGO_LIGHT.svg" alt="Mayand" width={90} height={28} className="h-6 sm:h-7 w-auto" />
          </div>
          <CartButton />
        </div>
      </header>

      {/* Product content */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
          {/* LEFT — Images */}
          <div>
            {/* Main image */}
            <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-white/[0.03] mb-2">
              <Image
                src={getProductImageUrl(allImages[activeImage])}
                alt={product.name}
                width={800}
                height={600}
                className="w-full h-full object-cover"
                priority
              />

              {/* Badge */}
              {product.badge && (
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold text-white uppercase"
                  style={{ backgroundColor: product.badge_color || '#458FFF' }}
                >
                  {product.badge}
                </span>
              )}

              {product.is_featured && (
                <span className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md text-[9px] font-semibold bg-black/40 backdrop-blur-sm text-[#FFD700]">
                  <Star size={9} fill="currentColor" /> Destacado
                </span>
              )}

              {/* Nav arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((activeImage - 1 + allImages.length) % allImages.length)}
                    className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((activeImage + 1) % allImages.length)}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 backdrop-blur-sm text-white/70 hover:text-white flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-1.5">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-[#458FFF] shadow-lg shadow-[#458FFF]/20'
                        : 'border-white/10 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image src={getProductImageUrl(img)} alt="" width={64} height={64} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Info */}
          <div className="flex flex-col">
            {/* Category + Price inline */}
            <div className="flex items-center justify-between mb-2">
              {product.category?.name && (
                <span
                  className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold"
                  style={{
                    backgroundColor: (product.category.color || '#458FFF') + '20',
                    color: product.category.color || '#458FFF'
                  }}
                >
                  {product.category.name}
                </span>
              )}
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-black text-[#FFD700]">
                  ${Number(product.price).toLocaleString()}
                </span>
                {product.price_unit && <span className="text-white/30 text-xs">/{product.price_unit}</span>}
              </div>
            </div>

            <h1 className="text-white text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-tight mb-1.5">
              {product.name}
            </h1>

            {product.price_wholesale && (
              <p className="text-emerald-400 text-[11px] mb-2">
                ${Number(product.price_wholesale).toLocaleString()} mayoreo ({product.wholesale_min_quantity || 10}+ pzs)
              </p>
            )}

            <p className="text-white/40 text-xs sm:text-sm leading-relaxed mb-3">
              {product.description}
            </p>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {product.tags.map(tag => (
                  <span
                    key={tag.slug}
                    className="px-2 py-0.5 rounded-md text-[9px] font-medium"
                    style={{ backgroundColor: (tag.color || '#6B7280') + '20', color: tag.color || '#6B7280' }}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Specs grid */}
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2 mb-3">
              {product.dimensions && (
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <div className="flex items-center gap-1 text-white/25 mb-0.5">
                    <Ruler size={10} />
                    <span className="text-[9px] uppercase tracking-wider font-medium">Dimensiones</span>
                  </div>
                  <p className="text-white font-semibold text-xs">{product.dimensions}</p>
                </div>
              )}
              <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <div className="flex items-center gap-1 text-white/25 mb-0.5">
                  <Layers size={10} />
                  <span className="text-[9px] uppercase tracking-wider font-medium">Material</span>
                </div>
                <p className="text-white font-semibold text-xs">{product.material?.name || '-'}</p>
              </div>
              {product.thickness && (
                <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-white/25 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Grosor</span>
                  <p className="text-white font-semibold text-xs">{product.thickness}</p>
                </div>
              )}
              <div className="p-2 sm:p-2.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                <span className="text-white/25 text-[9px] uppercase tracking-wider font-medium block mb-0.5">Disponibilidad</span>
                <p className="text-xs">
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

            {/* CTA buttons */}
            <div className="mt-auto flex gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm hover:bg-[#22c55e] active:scale-[0.98] transition-all"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Cotizar
              </a>
              <button
                onClick={() => {
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
                  setTimeout(() => setAdded(false), 1500)
                }}
                className={`flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3 rounded-xl font-bold text-xs sm:text-sm active:scale-[0.98] transition-all ${
                  added
                    ? 'bg-emerald-500 text-white'
                    : 'bg-[#458FFF] text-white hover:bg-[#3a7de6]'
                }`}
              >
                {added ? <Check size={14} /> : <ShoppingCart size={14} />}
                <span className="hidden sm:inline">{added ? 'Agregado' : 'Agregar'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ============ RELATED PRODUCTS ============ */}
        {related.length > 0 && (
          <section className="mt-6 sm:mt-10 pb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white text-sm sm:text-base font-bold">También te puede interesar</h2>
              <Link href="/catalogo" className="text-[#458FFF] text-[11px] font-semibold flex items-center gap-1 hover:gap-2 transition-all">
                Ver todo <ArrowRight size={11} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/catalogo/${rel.id}`}
                  className="group rounded-lg sm:rounded-xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:bg-white/[0.04] hover:border-white/[0.12] transition-all"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={getProductImageUrl(rel.image_url)}
                      alt={rel.name}
                      width={300}
                      height={225}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {rel.category?.name && (
                      <span className="absolute top-1 left-1 sm:top-2 sm:left-2 px-1.5 py-0.5 rounded text-[7px] sm:text-[9px] font-bold uppercase text-white/90" style={{ backgroundColor: (rel.category.color || '#458FFF') + 'CC' }}>
                        {rel.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="text-white font-bold text-[10px] sm:text-xs truncate mb-0.5 group-hover:text-[#458FFF] transition-colors">
                      {rel.name}
                    </h3>
                    <span className="text-[#FFD700] font-black text-xs sm:text-sm">
                      ${Number(rel.price).toLocaleString()}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
