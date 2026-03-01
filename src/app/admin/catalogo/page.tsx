'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Plus, Pencil, Trash2, Eye, EyeOff, Loader2, Package } from 'lucide-react'
import { getProductImageUrl } from '@/lib/storage'
import ProductForm from '@/components/admin/ProductForm'

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
  created_at: string
  category?: { name: string }
  images?: { id: string; url: string }[]
  tags?: { id: string; name: string; slug: string; color?: string }[]
}

export default function CatalogoAdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/catalog/products')
      const data = res.ok ? await res.json() : { products: [], error: 'Error al cargar productos' }
      if (data.products) {
        setProducts(data.products)
      }
    } catch (error) {
      console.error('Error cargando productos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/catalog/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const toggleActive = async (product: Product) => {
    try {
      const res = await fetch(`/api/catalog/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active }),
      })
      if (res.ok) {
        setProducts(
          products.map((p) =>
            p.id === product.id ? { ...p, is_active: !p.is_active } : p
          )
        )
      }
    } catch (error) {
      console.error('Error actualizando producto:', error)
    }
  }

  if (showForm) {
    return (
      <div>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-5">
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h1>
          <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 sm:p-6">
            <ProductForm
              product={editingProduct}
              onSuccess={() => {
                setShowForm(false)
                setEditingProduct(null)
                fetchProducts()
              }}
              onCancel={() => {
                setShowForm(false)
                setEditingProduct(null)
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Catálogo</h1>
          <p className="text-white/30 text-xs sm:text-sm mt-1">
            {products.length} productos en total
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-52 pl-9 pr-3 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors"
            />
          </div>
          <button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 bg-[#458FFF] hover:bg-[#3a7de6] text-white text-sm font-semibold rounded-xl transition-all active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Nuevo</span>
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={24} className="animate-spin text-[#458FFF]" />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Producto</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Categoría</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Precio</th>
                  <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">Estado</th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-white/25">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/[0.04] shrink-0">
                          {product.image_url ? (
                            <Image
                              src={getProductImageUrl(product.image_url)}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={16} className="text-white/15" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate">{product.name}</p>
                          <p className="text-white/20 text-xs truncate max-w-[200px]">
                            {product.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-white/40 text-sm">
                      {product.category?.name || '-'}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-white text-sm font-medium">${product.price.toLocaleString()}</span>
                      {product.price_unit && (
                        <span className="text-white/25 text-xs ml-0.5">{product.price_unit}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          product.is_active
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : 'bg-white/[0.06] text-white/30'
                        }`}>
                          {product.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                        {product.is_featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#FFD700]/15 text-[#FFD700]">
                            Destacado
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => toggleActive(product)}
                          className="p-2 text-white/20 hover:text-white/60 transition-colors rounded-lg hover:bg-white/[0.04]"
                          title={product.is_active ? 'Desactivar' : 'Activar'}
                        >
                          {product.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product)
                            setShowForm(true)
                          }}
                          className="p-2 text-white/20 hover:text-[#458FFF] transition-colors rounded-lg hover:bg-white/[0.04]"
                          title="Editar"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                          className="p-2 text-white/20 hover:text-red-400 transition-colors disabled:opacity-50 rounded-lg hover:bg-white/[0.04]"
                          title="Eliminar"
                        >
                          {deletingId === product.id ? (
                            <Loader2 size={15} className="animate-spin" />
                          ) : (
                            <Trash2 size={15} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package size={32} className="mx-auto text-white/10 mb-2" />
                <p className="text-white/25 text-sm">No se encontraron productos</p>
              </div>
            )}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2.5">
            {filteredProducts.map((product) => (
              <div key={product.id} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3.5">
                <div className="flex items-start gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/[0.04] shrink-0">
                    {product.image_url ? (
                      <Image
                        src={getProductImageUrl(product.image_url)}
                        alt={product.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={20} className="text-white/15" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{product.name}</p>
                    <p className="text-white/25 text-xs truncate">{product.category?.name || '-'}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-white font-bold text-sm">${product.price.toLocaleString()}</span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${
                        product.is_active ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/[0.06] text-white/30'
                      }`}>
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-1 mt-2.5 pt-2.5 border-t border-white/[0.04]">
                  <button
                    onClick={() => toggleActive(product)}
                    className="p-2 text-white/20 hover:text-white/60 transition-colors rounded-lg"
                  >
                    {product.is_active ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct(product)
                      setShowForm(true)
                    }}
                    className="p-2 text-white/20 hover:text-[#458FFF] transition-colors rounded-lg"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    disabled={deletingId === product.id}
                    className="p-2 text-white/20 hover:text-red-400 transition-colors disabled:opacity-50 rounded-lg"
                  >
                    {deletingId === product.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package size={32} className="mx-auto text-white/10 mb-2" />
                <p className="text-white/25 text-sm">No se encontraron productos</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
