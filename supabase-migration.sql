-- ============================================
-- SCRIPT DE MIGRACIÓN PARA CATÁLOGO
-- Ejecuta este script en el SQL Editor de Supabase
-- ============================================

-- 1. Agregar columna category_type a catalog_categories
ALTER TABLE catalog_categories 
ADD COLUMN IF NOT EXISTS category_type TEXT DEFAULT 'general' 
CHECK (category_type IN ('corte_laser', 'impresion', 'neon', 'senaletica', 'exhibidores', 'empaque', 'decoracion', 'industrial', 'general'));

-- 2. Agregar columna color a catalog_categories
ALTER TABLE catalog_categories 
ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#458FFF';

-- 3. Agregar columna image_url a catalog_categories
ALTER TABLE catalog_categories 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. Agregar columnas de precios a catalog_products
ALTER TABLE catalog_products 
ADD COLUMN IF NOT EXISTS price_wholesale DECIMAL(10,2);

ALTER TABLE catalog_products 
ADD COLUMN IF NOT EXISTS wholesale_min_quantity INTEGER DEFAULT 1;

-- 5. Crear tabla de tags si no existe
CREATE TABLE IF NOT EXISTS catalog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Crear tabla de relación producto-tags si no existe
CREATE TABLE IF NOT EXISTS catalog_product_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES catalog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

-- 7. Habilitar RLS en nuevas tablas
ALTER TABLE catalog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_product_tags ENABLE ROW LEVEL SECURITY;

-- 8. Crear políticas RLS para tags
DROP POLICY IF EXISTS "Permitir acceso público a tags" ON catalog_tags;
CREATE POLICY "Permitir acceso público a tags" ON catalog_tags FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a relación producto-tags" ON catalog_product_tags;
CREATE POLICY "Permitir acceso público a relación producto-tags" ON catalog_product_tags FOR ALL USING (true) WITH CHECK (true);

-- 9. Crear índices
CREATE INDEX IF NOT EXISTS idx_catalog_product_tags_product ON catalog_product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_catalog_product_tags_tag ON catalog_product_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_catalog_tags_active ON catalog_tags(is_active) WHERE is_active = true;

-- 10. Actualizar categorías existentes con category_type
UPDATE catalog_categories 
SET category_type = 'corte_laser', color = '#458FFF'
WHERE slug = 'corte-laser';

UPDATE catalog_categories 
SET category_type = 'impresion', color = '#10B981'
WHERE slug = 'impresion';

UPDATE catalog_categories 
SET category_type = 'neon', color = '#F59E0B'
WHERE slug = 'neon';

UPDATE catalog_categories 
SET category_type = 'senaletica', color = '#EF4444'
WHERE slug = 'senaletica';

UPDATE catalog_categories 
SET category_type = 'exhibidores', color = '#8B5CF6'
WHERE slug = 'exhibidores';

-- 11. Insertar nuevas categorías si no existen
INSERT INTO catalog_categories (name, slug, description, icon, sort_order, category_type, color) VALUES
  ('Empaque', 'empaque', 'Cajas y empaques personalizados', 'inventory_2', 6, 'empaque', '#EC4899'),
  ('Decoración', 'decoracion', 'Productos decorativos', 'home', 7, 'decoracion', '#14B8A6'),
  ('Industrial', 'industrial', 'Productos para uso industrial', 'factory', 8, 'industrial', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- 12. Insertar tags de ejemplo
INSERT INTO catalog_tags (name, slug, color) VALUES
  ('Nuevo', 'nuevo', '#10B981'),
  ('Oferta', 'oferta', '#EF4444'),
  ('Popular', 'popular', '#F59E0B'),
  ('Personalizable', 'personalizable', '#8B5CF6'),
  ('Eco-friendly', 'eco-friendly', '#14B8A6'),
  ('Premium', 'premium', '#FBBF24'),
  ('Stock', 'stock', '#3B82F6'),
  ('Sobre pedido', 'sobre-pedido', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- Verificación
SELECT 'Migración completada' as status;
