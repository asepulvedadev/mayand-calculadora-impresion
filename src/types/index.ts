// ============================================
// TIPOS PARA CATÁLOGO
// ============================================

// Tipos de categorías
export type CategoryType = 
  | 'corte_laser' 
  | 'impresion' 
  | 'neon' 
  | 'senaletica' 
  | 'exhibidores' 
  | 'empaque' 
  | 'decoracion' 
  | 'industrial' 
  | 'general';

export interface CatalogCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_type: CategoryType;
  color?: string;
  image_url?: string;
}

// Materiales del catálogo
export interface CatalogMaterial {
  id: string;
  name: string;
  slug: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

// Productos del catálogo
export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  material_id: string;
  dimensions: string;
  thickness?: string;
  
  // Precios
  price: number;
  price_wholesale?: number;
  price_unit?: string;
  wholesale_min_quantity?: number;
  
  image_url?: string;
  badge?: string;
  badge_color?: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  views: number;
  created_at: string;
  updated_at: string;
  
  // Relaciones
  category?: CatalogCategory;
  material?: CatalogMaterial;
  images?: CatalogProductImage[];
  tags?: CatalogTag[];
}

export interface CatalogProductImage {
  id: string;
  product_id: string;
  url: string;
  alt?: string;
  sort_order: number;
  created_at: string;
}

// Tags del catálogo
export interface CatalogTag {
  id: string;
  name: string;
  slug: string;
  color?: string;
  is_active: boolean;
  created_at: string;
}

// Características de productos
export interface CatalogProductFeature {
  id: string;
  product_id: string;
  feature_name: string;
  feature_value: string;
  created_at: string;
}

// ============================================
// TIPOS PARA CALCULADORA DE IMPRESIÓN
// ============================================

export type PrintMaterial = 'vinil' | 'lona' | 'vinil_transparente';

export interface QuoteData {
  width: number;
  height: number;
  material: PrintMaterial;
  area: number;
  unitPrice: number;
  subtotal: number;
  iva: number;
  total: number;
  hasBulkDiscount: boolean;
  isPromotion: boolean;
}
