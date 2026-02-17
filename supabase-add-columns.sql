-- Script simple para agregar columnas faltantes
-- Ejecuta esto en el SQL Editor de Supabase

-- Agregar columna price_wholesale si no existe
ALTER TABLE catalog_products 
ADD COLUMN IF NOT EXISTS price_wholesale DECIMAL(10,2);

-- Agregar columna wholesale_min_quantity si no existe
ALTER TABLE catalog_products 
ADD COLUMN IF NOT EXISTS wholesale_min_quantity INTEGER DEFAULT 1;

-- Verificar que las columnas existen
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'catalog_products' 
AND column_name IN ('price_wholesale', 'wholesale_min_quantity');
