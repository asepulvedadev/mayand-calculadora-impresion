'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X, CloudUpload, Save, Plus, Trash2, Loader2, ChevronDown } from 'lucide-react'
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

const inputClass = 'w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/20 focus:border-[#458FFF]/40 focus:outline-none transition-colors'
const labelClass = 'block text-[10px] sm:text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider'

function SectionToggle({ label, open, onToggle, count }: { label: string; open: boolean; onToggle: () => void; count?: number }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center justify-between py-3 border-t border-white/[0.06] group"
    >
      <span className="text-xs font-bold uppercase tracking-wider text-white/30 group-hover:text-white/50 transition-colors">
        {label}
        {count !== undefined && count > 0 && (
          <span className="ml-2 px-1.5 py-0.5 bg-[#458FFF]/15 text-[#458FFF] rounded text-[10px]">{count}</span>
        )}
      </span>
      <ChevronDown
        size={14}
        className={`text-white/20 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      />
    </button>
  )
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const [images, setImages] = useState<ProductImage[]>([])
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryType, setNewCategoryType] = useState<CategoryType>('general')
  const [newCategoryColor, setNewCategoryColor] = useState('#458FFF')

  const [error, setError] = useState<string | null>(null)

  // Collapsible sections
  const [showDetails, setShowDetails] = useState(!!product)
  const [showExtras, setShowExtras] = useState(!!product)

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

  useEffect(() => {
    async function fetchData() {
      const [catsRes, matsRes, tagsRes] = await Promise.all([
        fetch('/api/catalog/categories'),
        fetch('/api/catalog/materials'),
        fetch('/api/catalog/tags')
      ])

      const catsData = catsRes.ok ? await catsRes.json() : { categories: [] }
      const matsData = matsRes.ok ? await matsRes.json() : { materials: [] }
      const tagsData = tagsRes.ok ? await tagsRes.json() : { tags: [] }

      setCategories(catsData.categories || [])
      setMaterials(matsData.materials || [])
      setTags(tagsData.tags || [])
    }
    fetchData()
  }, [])

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

      if (product.tags) {
        setSelectedTags(product.tags.map((t: Tag) => t.id))
      }

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
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setError('Tipo de archivo no válido. Solo se permiten JPG, PNG, GIF y WebP.')
        return
      }

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

  const selectedCategory = categories.find(c => c.id === formData.category_id)

  // Count filled detail fields
  const detailCount = [formData.description, formData.material_id, formData.dimensions, formData.thickness, formData.price_wholesale, formData.stock !== -1 ? 'x' : ''].filter(Boolean).length
  // Count filled extras
  const extraCount = [selectedTags.length > 0 ? 'x' : '', formData.badge, formData.is_featured ? 'x' : ''].filter(Boolean).length

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* ═══ BÁSICO (always open) ═══ */}
      <div className="space-y-4">
        {/* Row 1: Image + Name */}
        <div className="flex gap-3">
          {/* Main image */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-white/[0.04] rounded-xl overflow-hidden border border-dashed border-white/[0.1] shrink-0 group">
            {(images[0]?.preview || images[0]?.url) ? (
              <>
                <Image
                  src={images[0].preview || getProductImageUrl(images[0].url) || '/placeholder-product.jpg'}
                  alt="Imagen principal"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={10} className="text-white" />
                </button>
              </>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                <CloudUpload size={18} className="text-white/15 mb-1" />
                <span className="text-[9px] text-white/20">Foto</span>
                <input
                  ref={(el) => { fileInputRefs.current[0] = el }}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if (images.length === 0) setImages([{ url: '', file: undefined, preview: undefined }])
                    handleFileChange(0, e)
                  }}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name + Category + Price */}
          <div className="flex-1 space-y-2.5">
            <div>
              <label className={labelClass}>Nombre *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={inputClass}
                placeholder="Ej: Trofeo de Acrílico"
              />
            </div>

            {/* Category + Price + Unit in one row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className={`${labelClass} mb-0`}>Categoría *</label>
                  <button
                    type="button"
                    onClick={() => setShowNewCategory(!showNewCategory)}
                    className="text-[10px] text-[#458FFF]/60 hover:text-[#458FFF] flex items-center gap-0.5 transition-colors"
                  >
                    <Plus size={10} />
                  </button>
                </div>
                <div className="relative">
                  {selectedCategory?.color && (
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                  )}
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    required
                    className={`${inputClass} ${selectedCategory?.color ? 'pl-8' : ''}`}
                  >
                    <option value="">Categoría</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                <div className="col-span-2">
                  <label className={labelClass}>Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    required
                    className={inputClass}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className={labelClass}>Unidad</label>
                  <input
                    type="text"
                    value={formData.price_unit}
                    onChange={(e) => setFormData({ ...formData, price_unit: e.target.value })}
                    className={inputClass}
                    placeholder="/ pza"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New category inline */}
        {showNewCategory && (
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.06]">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nombre"
                className={inputClass}
              />
              <select
                value={newCategoryType}
                onChange={(e) => setNewCategoryType(e.target.value as CategoryType)}
                className={inputClass}
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
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border border-white/[0.08]"
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="flex-1 px-3 py-2 bg-[#458FFF] hover:bg-[#3a7de6] text-white rounded-xl text-sm font-medium transition-colors"
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ DETALLES (collapsible) ═══ */}
      <div>
        <SectionToggle label="Detalles" open={showDetails} onToggle={() => setShowDetails(!showDetails)} count={detailCount} />
        {showDetails && (
          <div className="space-y-4 pt-3">
            {/* Description */}
            <div>
              <label className={labelClass}>Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className={`${inputClass} resize-none`}
                placeholder="Describe el producto..."
              />
            </div>

            {/* Material */}
            <div>
              <label className={labelClass}>Material</label>
              <select
                value={formData.material_id}
                onChange={(e) => setFormData({ ...formData, material_id: e.target.value })}
                className={inputClass}
              >
                <option value="">Seleccionar material</option>
                {materials.map((mat) => (
                  <option key={mat.id} value={mat.id}>
                    {mat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimensions & Thickness */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Dimensiones</label>
                <input
                  type="text"
                  value={formData.dimensions}
                  onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                  className={inputClass}
                  placeholder="Ej: 20 x 15 x 5 cm"
                />
              </div>
              <div>
                <label className={labelClass}>Calibre/Grosor</label>
                <input
                  type="text"
                  value={formData.thickness}
                  onChange={(e) => setFormData({ ...formData, thickness: e.target.value })}
                  className={inputClass}
                  placeholder="Ej: 6 mm"
                />
              </div>
            </div>

            {/* Wholesale + Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Precio Mayoreo</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price_wholesale || ''}
                  onChange={(e) => setFormData({ ...formData, price_wholesale: e.target.value ? parseFloat(e.target.value) : null })}
                  className={inputClass}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className={labelClass}>Cant. mín. mayoreo</label>
                <input
                  type="number"
                  min="1"
                  value={formData.wholesale_min_quantity}
                  onChange={(e) => setFormData({ ...formData, wholesale_min_quantity: parseInt(e.target.value) || 1 })}
                  className={inputClass}
                  placeholder="10"
                />
              </div>
              <div>
                <label className={labelClass}>Stock</label>
                <input
                  type="number"
                  min="-1"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || -1 })}
                  className={inputClass}
                  placeholder="-1 = infinito"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ═══ EXTRAS (collapsible) ═══ */}
      <div>
        <SectionToggle label="Extras" open={showExtras} onToggle={() => setShowExtras(!showExtras)} count={extraCount} />
        {showExtras && (
          <div className="space-y-4 pt-3">
            {/* Tags */}
            <div>
              <label className={labelClass}>Tags</label>
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                      selectedTags.includes(tag.id)
                        ? 'text-white'
                        : 'bg-white/[0.04] text-white/30 hover:text-white/50 border border-white/[0.06]'
                    }`}
                    style={selectedTags.includes(tag.id) ? { backgroundColor: (tag.color || '#3B82F6') + '30', color: tag.color || '#3B82F6', borderWidth: 1, borderColor: (tag.color || '#3B82F6') + '40' } : {}}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Etiqueta (badge)</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className={inputClass}
                  placeholder="Ej: Nuevo"
                />
              </div>
              <div>
                <label className={labelClass}>Color de etiqueta</label>
                <input
                  type="color"
                  value={formData.badge_color}
                  onChange={(e) => setFormData({ ...formData, badge_color: e.target.value })}
                  className="w-full h-10 px-2 py-1 bg-white/[0.04] border border-white/[0.08] rounded-xl"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-white/[0.15] bg-white/[0.04] text-[#458FFF] focus:ring-[#458FFF]/30"
                />
                <span className="text-white/40 text-sm">Activo</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-white/[0.15] bg-white/[0.04] text-[#FFD700] focus:ring-[#FFD700]/30"
                />
                <span className="text-white/40 text-sm">Destacado</span>
              </label>
            </div>

            {/* Additional images */}
            <div>
              <label className={labelClass}>Imágenes adicionales</label>
              <div className="grid grid-cols-3 gap-2">
                {images.slice(1).map((img, index) => (
                  <div key={index + 1} className="relative aspect-square bg-white/[0.04] rounded-xl overflow-hidden border border-dashed border-white/[0.1] group">
                    {img.preview || img.url ? (
                      <>
                        <Image
                          src={img.preview || getProductImageUrl(img.url) || '/placeholder-product.jpg'}
                          alt={`Imagen ${index + 2}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index + 1)}
                          className="absolute top-1.5 right-1.5 p-1 bg-red-500/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={10} className="text-white" />
                        </button>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-white/[0.02] transition-colors">
                        <CloudUpload size={16} className="text-white/15 mb-1" />
                        <span className="text-[9px] text-white/20">Foto {index + 2}</span>
                        <input
                          ref={(el) => { fileInputRefs.current[index + 1] = el }}
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileChange(index + 1, e)}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                ))}

                {images.length < 3 && (
                  <button
                    type="button"
                    onClick={addImageSlot}
                    className="aspect-square bg-white/[0.02] rounded-xl border border-dashed border-white/[0.08] flex flex-col items-center justify-center hover:border-[#458FFF]/30 hover:bg-white/[0.03] transition-all"
                  >
                    <Plus size={16} className="text-white/15 mb-0.5" />
                    <span className="text-[9px] text-white/20">Agregar</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/[0.06]">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-white/30 hover:text-white/60 text-sm transition-colors rounded-xl"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#458FFF] hover:bg-[#3a7de6] text-white text-sm font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          {(loading || uploading) ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {product?.id ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
