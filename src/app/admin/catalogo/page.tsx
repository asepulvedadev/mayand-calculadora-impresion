'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Search, Eye, EyeOff, Loader2 } from 'lucide-react'
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

  // Cargar productos
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/catalog/products')
      const data = await res.json()
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

  // Filtrar productos
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  )

  // Eliminar producto
  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    setDeletingId(id)
    try {
      const res = await fetch(`/api/catalog/products/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        setProducts(products.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Error eliminando producto:', error)
    } finally {
      setDeletingId(null)
    }
  }

  // Toggle estado activo
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
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-6">
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
          </h1>
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
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestión del Catálogo</h1>
          <p className="text-gray-400">
            {products.length} productos en total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => {
              setEditingProduct(null)
              setShowForm(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus size={18} />
            Nuevo producto
          </button>
        </div>
      </div>

      {/* Tabla de productos */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-blue-500" size={32} />
        </div>
      ) : (
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-800/30">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                        {product.image_url ? (
                          <Image
                            src={getProductImageUrl(product.image_url)}
                            alt={product.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            -
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">{product.name}</p>
                        <p className="text-gray-500 text-sm truncate max-w-xs">
                          {product.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-300">
                    {product.category?.name || '-'}
                  </td>
                  <td className="px-4 py-4 text-white font-medium">
                    ${product.price.toLocaleString()}
                    {product.price_unit && (
                      <span className="text-gray-400">{product.price_unit}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                      {product.is_featured && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          Destacado
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => toggleActive(product)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title={product.is_active ? 'Desactivar' : 'Activar'}
                      >
                        {product.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setEditingProduct(product)
                          setShowForm(true)
                        }}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Editar"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        disabled={deletingId === product.id}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
                        title="Eliminar"
                      >
                        {deletingId === product.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
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
              <p className="text-gray-400">
                No se encontraron productos
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
