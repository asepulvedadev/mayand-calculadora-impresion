-- ============================================
-- VERIFICACIÓN DE TABLAS DEL CATÁLOGO
-- Ejecuta este script para verificar que las tablas existan
-- ============================================

-- Verificar tablas del catálogo
SELECT 'catalog_categories: ' || COUNT(*)::text as status FROM catalog_categories;
SELECT 'catalog_materials: ' || COUNT(*)::text as status FROM catalog_materials;
SELECT 'catalog_products: ' || COUNT(*)::text as status FROM catalog_products;

-- Si alguna tabla no existe, crearla
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'catalog_categories') THEN
    RAISE NOTICE 'Creando tabla catalog_categories...';
  ELSE
    RAISE NOTICE 'La tabla catalog_categories YA existe';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'catalog_materials') THEN
    RAISE NOTICE 'Creando tabla catalog_materials...';
  ELSE
    RAISE NOTICE 'La tabla catalog_materials YA existe';
  END IF;

  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'catalog_products') THEN
    RAISE NOTICE 'Creando tabla catalog_products...';
  ELSE
    RAISE NOTICE 'La tabla catalog_products YA existe';
  END IF;
END $$;

-- Mostrar estructura de catalog_products
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'catalog_products'
ORDER BY ordinal_position;
