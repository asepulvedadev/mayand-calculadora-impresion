'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, Upload, Save, Loader2 } from 'lucide-react'
import { uploadProductImage, getProductImageUrl } from '@/lib/storage'

interface Category {
  id: string
  name: string
  slug: string
}

interface Material {
  id: string
  name: string
  slug: string
}

interface Product {
  id?: string
  name: string
  slug?: string
  description: string
  category_id: string
  material_id: string
  dimensions: string
  thickness: string
  price: number
  price_unit: string
  image_url: string
  badge: string
  badge_color: string
  stock: number
  is_active: boolean
  is_featured: boolean
}

interface ProductFormProps {
  product?: Product | null
  onSuccess: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    category_id: '',
    material_id: '',
    dimensions: '',
    thickness: '',
    price: 0,
    price_unit: '',
    image_url: '',
    badge: '',
    badge_color: '#458FFF',
    stock: -1,
    is_active: true,
    is_featured: false,
  })

  // Cargar categorías y materiales
  useEffect(() => {
    async function fetchData() {
      const [catsRes, matsRes] = await Promise.all([
        fetch('/api/catalog/categories'),
        fetch('/api/catalog/materials')
      ])

      const catsData = await catsRes.json()
      const matsData = await matsRes.json()

      setCategories(catsData.categories || [])
      setMaterials(matsData.materials || [])
    }
    fetchData()
  }, [])

  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (product) {
      setFormData(product)
      if (product.image_url) {
        setPreviewUrl(getProductImageUrl(product.image_url))
      }
    }
  }, [product])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validar tipo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.')
        return
      }

      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Archivo demasiado grande. Máximo 5MB.')
        return
      }

      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Subir imagen si hay una nueva
      let imagePath = formData.image_url
      if (selectedFile) {
        setUploading(true)
        const uploadResult = await uploadProductImage(selectedFile, formData.name)
        setUploading(false)

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Error al subir imagen')
        }
        imagePath = uploadResult.data!.path
      }

      const payload = {
        ...formData,
        image_url: imagePath,
        slug: generateSlug(formData.name),
      }

      const url = product?.id
        ? `/api/catalog/products/${product.id}`
        : '/api/catalog/products'
      const method = product?.id ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al guardar producto')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Imagen del producto
        </label>
        <div className="flex items-start gap-4">
          <div className="relative w-40 h-40 bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Vista previa"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                <Upload size={32} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Seleccionar imagen
            </button>
            <p className="text-xs text-gray-500 mt-2">
              JPG, PNG, GIF o WebP. Máximo 5MB.
            </p>
          </div>
        </div>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Nombre del producto *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ej: Trofeo de Acrílico"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
          Descripción *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
          rows={3}
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Describe el producto..."
        />
      </div>

      {/* Categoría y Material */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Categoría *
          </label>
          <select
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Material *
          </label>
          <select
            value={formData.material_id}
            onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Seleccionar material</option>
            {materials.map((mat) => (
              <option key={mat.id} value={mat.id}>
                {mat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dimensiones y Calibre */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Dimensiones *
          </label>
          <input
            type="text"
            value={formData.dimensions}
            onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 20 x 15 x 5 cm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Calibre/Grosor
          </label>
          <input
            type="text"
            value={formData.thickness}
            onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: 6 mm"
          />
        </div>
      </div>

      {/* Precio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Precio *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Unidad de precio
          </label>
          <input
            type="text"
            value={formData.price_unit}
            onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: / pza"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Stock
          </label>
          <input
            type="number"
            min="-1"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || -1 })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="-1 = infinito"
          />
        </div>
      </div>

      {/* Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Etiqueta (badge)
          </label>
          <input
            type="text"
            value={formData.badge}
            onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ej: Nuevo"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Color de etiqueta
          </label>
          <input
            type="color"
            value={formData.badge_color}
            onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
            className="w-full h-10 px-2 py-1 bg-gray-800 border border-gray-700 rounded-lg text-white"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-300">Producto activo</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
            className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
          />
          <span className="text-gray-300">Producto destacado</span>
        </label>
      </div>

      {/* Botones */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {(loading || uploading) && <Loader2 size={18} className="animate-spin" />}
          <Save size={18} />
          {product?.id ? 'Actualizar' : 'Crear'} producto
        </button>
      </div>
    </form>
  )
}
