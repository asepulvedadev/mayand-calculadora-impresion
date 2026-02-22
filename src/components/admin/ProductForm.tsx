'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, CloudUpload, Save, Plus, Trash2 } from 'lucide-react'
import { CircularProgress } from '@mui/material'
import { Close, Add, Delete } from '@mui/icons-material'
import { uploadProductImage, getProductImageUrl } from '@/lib/storage'
import { CategoryType } from '@/types'

interface Category {
  id: string
  name: string
  slug: string
  category_type: CategoryType
  color?: string
}

interface Material {
  id: string
  name: string
  slug: string
}

interface Tag {
  id: string
  name: string
  slug: string
  color?: string
}

interface ProductImage {
  url: string
  file?: File
  preview?: string
}

interface ProductFormData {
  name: string
  slug?: string
  description: string
  category_id: string
  material_id: string
  dimensions: string
  thickness: string
  price: number
  price_wholesale?: number | null
  price_unit: string
  wholesale_min_quantity?: number
  image_url: string
  badge: string
  badge_color: string
  stock: number
  is_active: boolean
  is_featured: boolean
}

interface ProductFormProps {
  product?: ProductFormData & { 
    id: string
    images?: { id: string; url: string }[]
    tags?: Tag[]
  } | null
  onSuccess: () => void
  onCancel: () => void
}

const CATEGORY_TYPES: { value: CategoryType; label: string }[] = [
  { value: 'corte_laser', label: 'Corte Láser' },
  { value: 'impresion', label: 'Impresión UV' },
  { value: 'neon', label: 'Letreros Neón' },
  { value: 'senaletica', label: 'Señalética' },
  { value: 'exhibidores', label: 'Exhibidores' },
  { value: 'empaque', label: 'Empaque' },
  { value: 'decoracion', label: 'Decoración' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'general', label: 'General' },
]

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  
  // Imágenes múltiples
  const [images, setImages] = useState<ProductImage[]>([])
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])
  
  // Nueva categoría
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>('general')
  const [newCategoryColor, setNewCategoryColor] = useState('#458FFF')
  
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    category_id: '',
    material_id: '',
    dimensions: '',
    thickness: '',
    price: 0,
    price_wholesale: null,
    price_unit: '',
    wholesale_min_quantity: 10,
    image_url: '',
    badge: '',
    badge_color: '#458FFF',
    stock: -1,
    is_active: true,
    is_featured: false,
  })

  // Cargar categorías, materiales y tags
  useEffect(() => {
    async function fetchData() {
      const [catsRes, matsRes, tagsRes] = await Promise.all([
        fetch('/api/catalog/categories'),
        fetch('/api/catalog/materials'),
        fetch('/api/catalog/tags')
      ])

      const catsData = await catsRes.json()
      const matsData = await matsRes.json()
      const tagsData = await tagsRes.json()

      setCategories(catsData.categories || [])
      setMaterials(matsData.materials || [])
      setTags(tagsData.tags || [])
    }
    fetchData()
  }, [])

  // Cargar datos del producto si se está editando
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        slug: product.slug,
        description: product.description || '',
        category_id: product.category_id || '',
        material_id: product.material_id || '',
        dimensions: product.dimensions || '',
        thickness: product.thickness || '',
        price: product.price || 0,
        price_wholesale: product.price_wholesale || null,
        price_unit: product.price_unit || '',
        wholesale_min_quantity: product.wholesale_min_quantity || 10,
        image_url: product.image_url || '',
        badge: product.badge || '',
        badge_color: product.badge_color || '#458FFF',
        stock: product.stock ?? -1,
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
      })

      // Cargar tags seleccionados
      if (product.tags) {
        setSelectedTags(product.tags.map((t: Tag) => t.id))
      }

      // Cargar imágenes existentes
      const existingImages: ProductImage[] = []
      if (product.image_url) {
        existingImages.push({ url: product.image_url })
      }
      if (product.images) {
        product.images.forEach((img) => {
          if (img.url !== product.image_url) {
            existingImages.push({ url: img.url })
          }
        })
      }
      setImages(existingImages)
    }
  }, [product])

  const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
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

      const newImages = [...images]
      newImages[index] = {
        file,
        preview: URL.createObjectURL(file),
        url: ''
      }
      setImages(newImages)
      setError(null)
    }
  }

  const addImageSlot = () => {
    if (images.length < 3) {
      setImages([...images, { url: '', file: undefined, preview: undefined }])
    }
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      setError('El nombre de la categoría es requerido')
      return
    }

    try {
      const slug = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      
      const res = await fetch('/api/catalog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategoryName,
          slug,
          category_type: newCategoryType,
          color: newCategoryColor,
          is_active: true
        })
      })

      if (!res.ok) {
        throw new Error('Error al crear categoría')
      }

      const data = await res.json()
      
      // Agregar la nueva categoría a la lista
      setCategories([...categories, data.category])
      setFormData({ ...formData, category_id: data.category.id })
      setShowNewCategory(false)
      setNewCategoryName('')
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear categoría')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Subir imágenes
      const uploadedUrls: string[] = []
      
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        
        if (img.file) {
          setUploading(true)
          const uploadResult = await uploadProductImage(img.file, formData.name)
          setUploading(false)

          if (!uploadResult.success) {
            throw new Error(uploadResult.error || 'Error al subir imagen')
          }
          uploadedUrls.push(uploadResult.data!.path)
        } else if (img.url) {
          uploadedUrls.push(img.url)
        }
      }

      const payload = {
        ...formData,
        image_url: uploadedUrls[0] || '',
        images: uploadedUrls.slice(1),
        tags: selectedTags,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
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
      setUploading(false)
    }
  }

  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      setSelectedTags(selectedTags.filter(id => id !== tagId))
    } else {
      setSelectedTags([...selectedTags, tagId])
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          {error}
        </div>
      )}

      {/* Imágenes múltiples */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Imágenes del producto (hasta 3)
        </label>
        <div className="grid grid-cols-3 gap-4">
          {images.map((img, index) => (
            <div key={index} className="relative aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 group">
              {img.preview || img.url ? (
                <>
                  <Image
                    src={img.preview || getProductImageUrl(img.url) || '/placeholder-product.jpg'}
                    alt={`Imagen ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 fontSize="small" className="text-white" />
                  </button>
                </>
              ) : (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
                  <CloudUpload fontSize="large" className="text-gray-500 mb-2" />
                  <span className="text-xs text-gray-500">Foto {index + 1}</span>
                  <input
                    ref={(el) => { fileInputRefs.current[index] = el }}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(index, e)}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ))}
          
          {/* Botón para agregar más imágenes */}
          {images.length < 3 && (
            <button
              type="button"
              onClick={addImageSlot}
              className="aspect-square bg-gray-800 rounded-lg border-2 border-dashed border-gray-600 flex flex-col items-center justify-center hover:border-blue-500 transition-colors"
            >
              <Plus fontSize="large" className="text-gray-500 mb-2" />
              <span className="text-xs text-gray-500">Agregar</span>
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          JPG, PNG, GIF o WebP. Máximo 5MB cada una.
        </p>
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

      {/* Categoría */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-sm font-medium text-gray-300">
            Categoría *
          </label>
          <button
            type="button"
            onClick={() => setShowNewCategory(!showNewCategory)}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <Plus fontSize="small" /> Nueva categoría
          </button>
        </div>
        
        {showNewCategory && (
          <div className="mb-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre de categoría"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              />
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as CategoryType)}
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm"
              >
                {CATEGORY_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={newCategoryColor}
                  onChange={(e) => setNewCategoryColor(e.target.value)}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
        
        <select
          value={formData.category_id}
          onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
          required
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Seleccionar categoría</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} ({cat.category_type})
            </option>
          ))}
        </select>
      </div>

      {/* Material */}
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

      {/* Precios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Precio Menudeo *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Precio Mayoreo
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price_wholesale || ''}
            onChange={(e) => setFormData({ ...formData, price_wholesale: e.target.value ? parseFloat(e.target.value) : null })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Cantidad mínima mayoreo
          </label>
          <input
            type="number"
            min="1"
            value={formData.wholesale_min_quantity}
            onChange={(e) => setFormData({ ...formData, wholesale_min_quantity: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="10"
          />
        </div>
      </div>

      {/* Unidad de precio y Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTags.includes(tag.id)
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              style={selectedTags.includes(tag.id) ? { backgroundColor: tag.color || '#3B82F6' } : {}}
            >
              {tag.name}
            </button>
          ))}
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
          {(loading || uploading) && <CircularProgress size={24} className="animate-spin" />}
          <Save size={18} />
          {product?.id ? 'Actualizar' : 'Crear'} producto
        </button>
      </div>
    </form>
  )
}
