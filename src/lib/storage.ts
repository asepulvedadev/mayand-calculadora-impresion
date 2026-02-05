import { supabase } from './supabase'

// ============================================
// CONFIGURACIÓN DE STORAGE
// ============================================

const STORAGE_BUCKET = 'product-images'

// Tipos de imagen permitidos
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
] as const

export type AllowedImageType = typeof ALLOWED_IMAGE_TYPES[number]

// Tamaño máximo: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024

// ============================================
// TIPOS
// ============================================

export interface UploadResult {
  success: boolean
  data?: {
    path: string
    publicUrl: string
  }
  error?: string
}

export interface DeleteResult {
  success: boolean
  error?: string
}

export interface ImageTransformOptions {
  width?: number
  height?: number
  resize?: 'cover' | 'contain' | 'fill'
  quality?: number
}

// ============================================
// FUNCIONES DE UTILIDAD
// ============================================

/**
 * Genera un nombre de archivo único para el producto
 */
export function generateProductImagePath(
  productName: string,
  fileName: string
): string {
  const timestamp = Date.now()
  const sanitizedName = productName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  
  const extension = fileName.split('.').pop()?.toLowerCase() || 'jpg'
  
  return `products/${sanitizedName}/${timestamp}.${extension}`
}

/**
 * Valida el tipo de archivo
 */
export function isValidImageType(mimeType: string): mimeType is AllowedImageType {
  return ALLOWED_IMAGE_TYPES.includes(mimeType as AllowedImageType)
}

/**
 * Valida el tamaño del archivo
 */
export function isValidFileSize(size: number): boolean {
  return size <= MAX_FILE_SIZE
}

// ============================================
// FUNCIONES DE STORAGE
// ============================================

/**
 * Sube una imagen de producto al storage de Supabase
 */
export async function uploadProductImage(
  file: File,
  productName: string
): Promise<UploadResult> {
  try {
    // Validar tipo de archivo
    if (!isValidImageType(file.type)) {
      return {
        success: false,
        error: `Tipo de archivo no permitido: ${file.type}. Tipos permitidos: ${ALLOWED_IMAGE_TYPES.join(', ')}`
      }
    }

    // Validar tamaño
    if (!isValidFileSize(file.size)) {
      return {
        success: false,
        error: `Archivo demasiado grande: ${(file.size / 1024 / 1024).toFixed(2)}MB. Máximo: ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(0)}MB`
      }
    }

    // Generar path único
    const path = generateProductImagePath(productName, file.name)

    // Subir archivo
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      return {
        success: false,
        error: `Error al subir imagen: ${error.message}`
      }
    }

    // Obtener URL pública
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(data.path)

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: urlData.publicUrl
      }
    }
  } catch (error) {
    console.error('Error uploading product image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al subir imagen'
    }
  }
}

/**
 * Elimina una imagen del storage
 */
export async function deleteProductImage(path: string): Promise<DeleteResult> {
  try {
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([path])

    if (error) {
      return {
        success: false,
        error: `Error al eliminar imagen: ${error.message}`
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error deleting product image:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido al eliminar imagen'
    }
  }
}

/**
 * Obtiene la URL pública de una imagen
 */
export function getProductImageUrl(
  path: string | null | undefined,
  transforms?: ImageTransformOptions
): string {
  if (!path) {
    return '/placeholder-product.jpg'
  }

  // Si ya es una URL completa, retornarla
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }

  const { data } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(path)

  // Aplicar transformaciones si se especifican
  if (transforms && (transforms.width || transforms.height)) {
    const baseUrl = data.publicUrl.split('?')[0]
    const params = new URLSearchParams()
    
    if (transforms.width) params.set('width', transforms.width.toString())
    if (transforms.height) params.set('height', transforms.height.toString())
    if (transforms.resize) params.set('resize', transforms.resize)
    if (transforms.quality) params.set('quality', transforms.quality.toString())
    
    return `${baseUrl}?${params.toString()}`
  }

  return data.publicUrl
}

/**
 * Lista todas las imágenes de un producto
 */
export async function listProductImages(productName: string): Promise<string[]> {
  try {
    const folderPath = `products/${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
    
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folderPath, {
        limit: 100,
        sortBy: { column: 'name', order: 'asc' }
      })

    if (error) {
      console.error('Error listing product images:', error)
      return []
    }

    return data.map(item => `${folderPath}/${item.name}`)
  } catch (error) {
    console.error('Error listing product images:', error)
    return []
  }
}

/**
 * Sube múltiples imágenes para un producto
 */
export async function uploadProductImages(
  files: File[],
  productName: string
): Promise<UploadResult[]> {
  const results = await Promise.all(
    files.map((file) => uploadProductImage(file, productName))
  )
  return results
}

// ============================================
// EXPORTAR CLIENTE DE STORAGE (para uso avanzado)
// ============================================

export const storageClient = {
  bucket: STORAGE_BUCKET,
  
  // Métodos básicos
  upload: supabase.storage.from(STORAGE_BUCKET).upload.bind(supabase.storage.from(STORAGE_BUCKET)),
  remove: supabase.storage.from(STORAGE_BUCKET).remove.bind(supabase.storage.from(STORAGE_BUCKET)),
  getPublicUrl: supabase.storage.from(STORAGE_BUCKET).getPublicUrl.bind(supabase.storage.from(STORAGE_BUCKET)),
  list: supabase.storage.from(STORAGE_BUCKET).list.bind(supabase.storage.from(STORAGE_BUCKET)),
  
  // Métodos personalizados
  uploadProductImage,
  deleteProductImage,
  getProductImageUrl,
  listProductImages,
  uploadProductImages,
  
  // Utilidades
  generateProductImagePath,
  isValidImageType,
  isValidFileSize,
  ALLOWED_IMAGE_TYPES,
  MAX_FILE_SIZE
}
