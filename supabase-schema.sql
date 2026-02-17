-- Schema para Mayand - Base de datos Supabase
-- Ejecuta este script en el SQL Editor de tu proyecto Supabase

-- ============================================
-- TABLAS EXISTENTES (Corte Láser)
-- ============================================

-- Tabla de materiales para corte láser
CREATE TABLE IF NOT EXISTS laser_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  thickness DECIMAL(5,2) NOT NULL,
  sheet_width DECIMAL(10,2) NOT NULL,
  sheet_height DECIMAL(10,2) NOT NULL,
  usable_width DECIMAL(10,2) NOT NULL,
  usable_height DECIMAL(10,2) NOT NULL,
  price_per_sheet DECIMAL(10,2) NOT NULL,
  color TEXT,
  finish TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones de corte láser
CREATE TABLE IF NOT EXISTS laser_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES laser_materials(id) ON DELETE SET NULL,
  piece_width DECIMAL(10,2) NOT NULL,
  piece_height DECIMAL(10,2) NOT NULL,
  cutting_minutes DECIMAL(10,2) NOT NULL,
  requires_assembly BOOLEAN DEFAULT false,
  assembly_cost_per_piece DECIMAL(10,2) DEFAULT 0,
  cutting_rate_per_minute DECIMAL(10,2) NOT NULL,
  sheets_needed INTEGER NOT NULL,
  material_cost DECIMAL(10,2) NOT NULL,
  cutting_cost DECIMAL(10,2) NOT NULL,
  assembly_cost DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de configuraciones
CREATE TABLE IF NOT EXISTS laser_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NUEVAS TABLAS PARA EL CATÁLOGO
-- ============================================

-- Categorías del catálogo
CREATE TABLE IF NOT EXISTS catalog_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Nuevos campos para categorías tipadas
  category_type TEXT DEFAULT 'general' CHECK (category_type IN ('corte_laser', 'impresion', 'neon', 'senaletica', 'exhibidores', 'empaque', 'decoracion', 'industrial', 'general')),
  color TEXT DEFAULT '#458FFF',
  image_url TEXT
);

-- Materiales disponibles para productos
CREATE TABLE IF NOT EXISTS catalog_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Productos del catálogo
CREATE TABLE IF NOT EXISTS catalog_products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  category_id UUID REFERENCES catalog_categories(id) ON DELETE SET NULL,
  material_id UUID REFERENCES catalog_materials(id) ON DELETE SET NULL,
  dimensions TEXT NOT NULL,
  thickness TEXT,
  
  -- Precios
  price DECIMAL(10,2) NOT NULL, -- Precio base (menudeo)
  price_wholesale DECIMAL(10,2), -- Precio de mayoreo
  price_unit TEXT DEFAULT '',
  wholesale_min_quantity INTEGER DEFAULT 1, -- Cantidad mínima para precio de mayoreo
  
  image_url TEXT,
  badge TEXT,
  badge_color TEXT DEFAULT '#458FFF',
  stock INTEGER DEFAULT -1, -- -1 = infinito/sobre pedido
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Imágenes adicionales de productos
CREATE TABLE IF NOT EXISTS catalog_product_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Características/opciones de productos
CREATE TABLE IF NOT EXISTS catalog_product_features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
  feature_name TEXT NOT NULL,
  feature_value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tags para productos
CREATE TABLE IF NOT EXISTS catalog_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  color TEXT DEFAULT '#6B7280',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relación muchos a muchos entre productos y tags
CREATE TABLE IF NOT EXISTS catalog_product_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES catalog_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, tag_id)
);

-- Carrito de compras
CREATE TABLE IF NOT EXISTS catalog_cart (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT NOT NULL,
  product_id UUID REFERENCES catalog_products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Órdenes/Pedidos
CREATE TABLE IF NOT EXISTS catalog_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detalles de orden
CREATE TABLE IF NOT EXISTS catalog_order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES catalog_orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES catalog_products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar configuraciones por defecto
INSERT INTO laser_settings (key, value) VALUES
  ('cutting_rate_per_minute', 8.00),
  ('profit_margin', 0.50)
ON CONFLICT (key) DO NOTHING;

-- Insertar materiales de ejemplo para corte láser
INSERT INTO laser_materials (name, thickness, sheet_width, sheet_height, usable_width, usable_height, price_per_sheet, color, finish, is_active) VALUES
  ('MDF 3mm', 3.00, 122.00, 244.00, 120.00, 240.00, 180.00, 'Natural', 'Mate', true),
  ('MDF 6mm', 6.00, 122.00, 244.00, 120.00, 240.00, 280.00, 'Natural', 'Mate', true),
  ('Acrílico Transparente', 3.00, 122.00, 244.00, 120.00, 240.00, 450.00, 'Transparente', 'Brillante', true),
  ('Acrílico Negro', 3.00, 122.00, 244.00, 120.00, 240.00, 520.00, 'Negro', 'Brillante', true),
  ('Acrílico Blanco', 3.00, 122.00, 244.00, 120.00, 240.00, 480.00, 'Blanco', 'Brillante', true),
  ('Madera Triplay 4mm', 4.00, 122.00, 244.00, 120.00, 240.00, 220.00, 'Natural', 'Natural', true),
  ('Cartón Corrugado', 4.00, 100.00, 140.00, 98.00, 138.00, 45.00, 'Marrón', 'Mate', true)
ON CONFLICT DO NOTHING;

-- Insertar categorías del catálogo con tipos
INSERT INTO catalog_categories (name, slug, description, icon, sort_order, category_type, color) VALUES
  ('Corte Láser', 'corte-laser', 'Productos cortados con precisión láser', 'precision_manufacturing', 1, 'corte_laser', '#458FFF'),
  ('Impresión UV', 'impresion', 'Impresión de alta calidad UV', 'print', 2, 'impresion', '#10B981'),
  ('Letreros Neón', 'neon', 'Letreros con iluminación LED', 'lightbulb', 3, 'neon', '#F59E0B'),
  ('Señalética', 'senaletica', 'Señalamientos y señalización', 'branding_watermark', 4, 'senaletica', '#EF4444'),
  ('Exhibidores', 'exhibidores', 'Displays y exhibidores publicitarios', 'layers', 5, 'exhibidores', '#8B5CF6'),
  ('Empaque', 'empaque', 'Cajas y empaques personalizados', 'inventory_2', 6, 'empaque', '#EC4899'),
  ('Decoración', 'decoracion', 'Productos decorativos', 'home', 7, 'decoracion', '#14B8A6'),
  ('Industrial', 'industrial', 'Productos para uso industrial', 'factory', 8, 'industrial', '#6B7280')
ON CONFLICT (slug) DO NOTHING;

-- Insertar tags de ejemplo
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

-- Insertar materiales del catálogo
INSERT INTO catalog_materials (name, slug, description) VALUES
  ('Acrílico Premium', 'acrilico', 'Acrílico de alta transparencia y resistencia'),
  ('Madera de Pino', 'madera-pino', 'Madera natural de pino seleccionada'),
  ('Flex Neón', 'flex-neon', 'LED flexible para letreros'),
  ('Estireno Rígido', 'estireno', 'Plástico rígido para señalética'),
  ('Coroplast', 'coroplast', 'Plástico corrugado resistente'),
  ('Cartulina Sulfatada', 'cartulina', 'Cartón resistente para empaque'),
  ('MDF', 'mdf', 'Tablero de fibras de densidad media'),
  ('Metal', 'metal', 'Láminas metálicas')
ON CONFLICT DO NOTHING;

-- Insertar productos de ejemplo (10 productos)
INSERT INTO catalog_products (name, slug, description, category_id, material_id, dimensions, thickness, price, price_unit, image_url, badge, badge_color, is_featured) VALUES
(
  'Trofeo de Acrílico Cristal',
  'trofeo-acrilico-cristal',
  'Trofeo de alta gama con bordes pulidos a fuego para un acabado brillante y profesional.',
  (SELECT id FROM catalog_categories WHERE slug = 'corte-laser'),
  (SELECT id FROM catalog_materials WHERE slug = 'acrilico'),
  '20 x 15 x 5 cm',
  '6 mm',
  450.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBgU1CJViOcN9mShdIHYT7GQXhElORESrsPL7WVwBCbIFAM7ZetKVz7yMEF9x2_z5xLlI7ZXS9994a1lF8cm5-NqFXl60yC59EGzkT1krOTM926078X205m9Oc8nWP4GHIVpTCGsO2vF7DsYOBIFYkoUCqCNwaCgB0cWdV6sgYxYFOOqMoekikaeC523a6Lj9mYALnZ82kIFhQj3wqF463yad2LfLbBXUOxK5Cma1mb0l6jUdtaAmjlBJjGTHHMqBGwVyvyXT8Vt8k',
  'Corte Láser',
  '#458FFF',
  true
),
(
  'Letrero Neón Custom',
  'letrero-neon-custom',
  'Iluminación LED flexible sobre base de acrílico cristalino. Ideal para interiores y eventos.',
  (SELECT id FROM catalog_categories WHERE slug = 'neon'),
  (SELECT id FROM catalog_materials WHERE slug = 'flex-neon'),
  '60 x 40 cm',
  '3 mm (Base)',
  1200.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDlNC83txapGh1eKRiP0VzY0fbV0rhwbsCuZlxwsMWYF0lliDX4tlTBpJKKpnyUCthJkgjO0jqNNfCbUZpWJKYDvK0NakaZfSOHa8hERV4_Vc1C2osy4zUF-erLxLX7vENwU-A7E3_N84sf_UmjBSbXb8P6LKSj-YNzZsHVOZH1JtyAmaNOIygna5qVM6pmJ5XRY8Te5nwv_nCEitfjEp3a1QtcUT9fz70MBq9QMwvFkHTw_aKDGvrgPet9-vHkd2SWkAyL943BqF4',
  'Letreros',
  '#FFB800',
  true
),
(
  'Señalética Industrial',
  'senaletica-industrial',
  'Impresión UV directa sobre estireno de alta resistencia. Colores vibrantes y duraderos.',
  (SELECT id FROM catalog_categories WHERE slug = 'senaletica'),
  (SELECT id FROM catalog_materials WHERE slug = 'estireno'),
  '30 x 30 cm',
  '40 pts',
  180.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCnONqQ9vs14dPFWkVjXigYVEcGI_rv4fH0n5tVQmSR1FDHUwGQgzFqP8mc8MNNJCcJizkgCgQpt1gay3IuOqMTfQWcs2Taw4MTWF6rbLo555OX3oSksCJLhTa48y8q4xAT6FNCxyoO-aC8lZNmko5-nDR9FWkKXlMbplSYIyMAeN9c7S3mPQ46CV6Wizj4QVgkkwifCLnvMZuNebODtBLqwyAeA4t72XBxvAfL0df9zeXF-zim3hzWidojSjxY-1qFbAv67DVKyts',
  'Señalética',
  '#27AE60',
  true
),
(
  'Placa de Madera Grabada',
  'placa-madera-grabada',
  'Grabado láser de alta profundidad en madera de pino seleccionada. Acabado natural o barnizado.',
  (SELECT id FROM catalog_categories WHERE slug = 'corte-laser'),
  (SELECT id FROM catalog_materials WHERE slug = 'madera-pino'),
  '15 x 15 x 1.2 cm',
  '12 mm',
  220.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBL0XzunYlJjf-bgN-M5X9mpYvpAHNcJC5HRSuouFdUiyYe7LymA3aJ1nOZaTmliXtarZdSRZ0uJjQBn1ukOvbBactM5PefnCFDxfQvq7xyn2aYSfDtN3gxWXo9yp8Kxy6n9mILQkD3BftHL9k1YDiYUBX2jVIGuGqkaAkZwf02GhlQ9gJZ-rA0c51BNq5Y6GpvGx0jgxvEdjY3d9Wt2hKrmXOcVY5nLXbqIvWuAiRDNu6-KT6SZAKlMjs7Pgp8f2f2d-43cEsPdv8',
  'Corte Láser',
  '#8B4513',
  false
),
(
  'Display Publicitario',
  'display-publicitario',
  'Display tipo caballete impreso en coroplast. Ligero, resistente y fácil de transportar.',
  (SELECT id FROM catalog_categories WHERE slug = 'exhibidores'),
  (SELECT id FROM catalog_materials WHERE slug = 'coroplast'),
  '100 x 200 cm',
  '4 mm',
  850.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAJOW1xA04upzJUaQkBlQ2RUH4yXvQMsTvnrThZ3Ux-h0Ggybn5Pjfr8Ixwmkvwk_CZ7Vh4i-SDER7w0oILYpw5gdw8hGpE6UGp63EoIobiCxBuSHiOo52Lkl7ddN28AFbxJ2XPl9uZLHohYoJWg_P4kifA6Bt3SrJrTFr6k1zq29b4q2JgWWH2vT318bsACHgBi4fwmUKwaspFj_hOWlKeTvHjtofRBiIqFhwRLRvZ2iNO14jzUZOueaL-sV1weQG16KPvdD4RvWs',
  'Exhibidor',
  '#E91E63',
  true
),
(
  'Caja para Empaque',
  'caja-empaque',
  'Corte y doblez de precisión en cartulina sulfatada. Personalizable con logo grabado o impreso.',
  (SELECT id FROM catalog_categories WHERE slug = 'corte-laser'),
  (SELECT id FROM catalog_materials WHERE slug = 'cartulina'),
  '10 x 10 x 10 cm',
  '12 pts',
  45.00,
  '/ pza',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAn__fuf322hc2k3cqngvAGiAJlDhLOI8GnXvuTtuiCXZzx-oEx17GKNXB1bo5N4lH450dSOyZ1UjBADKVIg0eqPLgC1vg8JGbg12uftkvlB5EwKkFc-4Fp-6pdHKqGR7aKmONeXOJ7sq_HtuaueRxfvhA5H-z-VhSUnTiBxLoZ4Uxl6nmT-98LoQnoUyHPUKN1U8Q90Z3ksCTNSO50DR6MW9s8d0D8YiVi_TvjzBxdsUTurFifeXmBG6Q6biHX7nY1xogvCtbeeIQ',
  'Corte Láser',
  '#795548',
  false
),
(
  'Llavero Personalizado Acrílico',
  'llavero-acrilico',
  'Llaveros de acrílico con grabado láser personalizado. Perfectos para eventos y souvenirs.',
  (SELECT id FROM catalog_categories WHERE slug = 'corte-laser'),
  (SELECT id FROM catalog_materials WHERE slug = 'acrilico'),
  '5 x 3 x 0.3 cm',
  '3 mm',
  35.00,
  '/ pza',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuABCD1234567890',
  'Souvenir',
  '#00BCD4',
  false
),
(
  'Panel Decorativo MDF',
  'panel-decorativo-mdf',
  'Paneles decorativos de MDF con corte láser. Ideales para paredes y decoración de interiores.',
  (SELECT id FROM catalog_categories WHERE slug = 'corte-laser'),
  (SELECT id FROM catalog_materials WHERE slug = 'mdf'),
  '60 x 60 cm',
  '6 mm',
  320.00,
  '/ pza',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBCDE2345678901',
  'Decoración',
  '#FF5722',
  false
),
(
  'Cupón Luminoso Neón',
  'cupon-neon',
  'Letrero de neón en forma de cupón o promoción. Ideal para comercios y eventos.',
  (SELECT id FROM catalog_categories WHERE slug = 'neon'),
  (SELECT id FROM catalog_materials WHERE slug = 'flex-neon'),
  '40 x 30 cm',
  '3 mm',
  580.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCDEF3456789012',
  'Promoción',
  '#FFC107',
  true
),
(
  'Placa Metálica Identificación',
  'placa-metalica',
  'Placa de metal con grabado láser de alta resistencia. Ideal para identificación industrial.',
  (SELECT id FROM catalog_categories WHERE slug = 'senaletica'),
  (SELECT id FROM catalog_materials WHERE slug = 'metal'),
  '25 x 10 cm',
  '1 mm',
  195.00,
  '',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDEFG4567890123',
  'Industrial',
  '#607D8B',
  false
)
ON CONFLICT DO NOTHING;

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_laser_materials_active ON laser_materials(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_laser_quotes_created ON laser_quotes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_laser_settings_key ON laser_settings(key);

CREATE INDEX IF NOT EXISTS idx_catalog_categories_active ON catalog_categories(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_catalog_categories_order ON catalog_categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_catalog_materials_active ON catalog_materials(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_catalog_products_active ON catalog_products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_catalog_products_category ON catalog_products(category_id);
CREATE INDEX IF NOT EXISTS idx_catalog_products_featured ON catalog_products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_catalog_product_tags_product ON catalog_product_tags(product_id);
CREATE INDEX IF NOT EXISTS idx_catalog_product_tags_tag ON catalog_product_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_catalog_tags_active ON catalog_tags(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_catalog_cart_session ON catalog_cart(session_id);
CREATE INDEX IF NOT EXISTS idx_catalog_orders_status ON catalog_orders(status);
CREATE INDEX IF NOT EXISTS idx_catalog_orders_created ON catalog_orders(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE laser_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_product_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE catalog_order_items ENABLE ROW LEVEL SECURITY;

-- Políticas RLS - Acceso público (lectura/escritura)
DROP POLICY IF EXISTS "Permitir acceso público a materiales" ON laser_materials;
CREATE POLICY "Permitir acceso público a materiales" ON laser_materials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a cotizaciones" ON laser_quotes;
CREATE POLICY "Permitir acceso público a cotizaciones" ON laser_quotes FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a configuraciones" ON laser_settings;
CREATE POLICY "Permitir acceso público a configuraciones" ON laser_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a categorías" ON catalog_categories;
CREATE POLICY "Permitir acceso público a categorías" ON catalog_categories FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a materiales" ON catalog_materials;
CREATE POLICY "Permitir acceso público a materiales" ON catalog_materials FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a productos" ON catalog_products;
CREATE POLICY "Permitir acceso público a productos" ON catalog_products FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a imágenes" ON catalog_product_images;
CREATE POLICY "Permitir acceso público a imágenes" ON catalog_product_images FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a características" ON catalog_product_features;
CREATE POLICY "Permitir acceso público a características" ON catalog_product_features FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a tags" ON catalog_tags;
CREATE POLICY "Permitir acceso público a tags" ON catalog_tags FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a relación producto-tags" ON catalog_product_tags;
CREATE POLICY "Permitir acceso público a relación producto-tags" ON catalog_product_tags FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a carrito" ON catalog_cart;
CREATE POLICY "Permitir acceso público a carrito" ON catalog_cart FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a órdenes" ON catalog_orders;
CREATE POLICY "Permitir acceso público a órdenes" ON catalog_orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir acceso público a detalles de orden" ON catalog_order_items;
CREATE POLICY "Permitir acceso público a detalles de orden" ON catalog_order_items FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- VERIFICACIÓN DE TABLAS CREADAS
-- ============================================

SELECT 'Tabla laser_materials: ' || COUNT(*)::text as status FROM laser_materials;
SELECT 'Tabla laser_quotes: ' || COUNT(*)::text as status FROM laser_quotes;
SELECT 'Tabla laser_settings: ' || COUNT(*)::text as status FROM laser_settings;
SELECT 'Materiales láser activos: ' || COUNT(*)::text as status FROM laser_materials WHERE is_active = true;

SELECT 'Categorías del catálogo: ' || COUNT(*)::text as status FROM catalog_categories;
SELECT 'Materiales del catálogo: ' || COUNT(*)::text as status FROM catalog_materials;
SELECT 'Productos del catálogo: ' || COUNT(*)::text as status FROM catalog_products;
SELECT 'Productos activos: ' || COUNT(*)::text as status FROM catalog_products WHERE is_active = true;
SELECT 'Productos destacados: ' || COUNT(*)::text as status FROM catalog_products WHERE is_featured = true;
