-- Script para verificar y crear tablas si no existen

-- Verificar si la tabla laser_materials existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'laser_materials') THEN
        RAISE NOTICE 'Creando tabla laser_materials...';
        CREATE TABLE laser_materials (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name TEXT NOT NULL,
          thickness DECIMAL(5,2) NOT NULL,
          sheet_width DECIMAL(6,2) NOT NULL,
          sheet_height DECIMAL(6,2) NOT NULL,
          usable_width DECIMAL(6,2) NOT NULL,
          usable_height DECIMAL(6,2) NOT NULL,
          price_per_sheet DECIMAL(10,2) NOT NULL,
          color TEXT,
          finish TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        RAISE NOTICE 'Tabla laser_materials ya existe';
    END IF;
END $$;

-- Verificar si la tabla laser_quotes existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'laser_quotes') THEN
        RAISE NOTICE 'Creando tabla laser_quotes...';
        CREATE TABLE laser_quotes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          material_id UUID REFERENCES laser_materials(id) ON DELETE CASCADE,
          piece_width DECIMAL(6,2) NOT NULL,
          piece_height DECIMAL(6,2) NOT NULL,
          quantity INTEGER NOT NULL,
          cutting_minutes DECIMAL(6,2) NOT NULL,
          requires_assembly BOOLEAN DEFAULT false,
          assembly_cost_per_piece DECIMAL(8,2) DEFAULT 0,
          cutting_rate_per_minute DECIMAL(6,2) DEFAULT 8,
          sheets_needed INTEGER NOT NULL,
          material_cost DECIMAL(10,2) NOT NULL,
          cutting_cost DECIMAL(10,2) NOT NULL,
          assembly_cost DECIMAL(10,2) NOT NULL,
          subtotal DECIMAL(10,2) NOT NULL,
          iva DECIMAL(10,2) NOT NULL,
          total DECIMAL(10,2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        RAISE NOTICE 'Tabla laser_quotes ya existe';
    END IF;
END $$;

-- Verificar si la tabla laser_settings existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'laser_settings') THEN
        RAISE NOTICE 'Creando tabla laser_settings...';
        CREATE TABLE laser_settings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          key TEXT UNIQUE NOT NULL,
          value DECIMAL(10,2) NOT NULL,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
    ELSE
        RAISE NOTICE 'Tabla laser_settings ya existe';
    END IF;
END $$;

-- Insertar datos de ejemplo si no existen
INSERT INTO laser_materials (name, thickness, sheet_width, sheet_height, usable_width, usable_height, price_per_sheet, color, finish)
SELECT 'Acrílico', 3.00, 120.00, 240.00, 120.00, 80.00, 950.00, 'Transparente', 'Brillo'
WHERE NOT EXISTS (SELECT 1 FROM laser_materials WHERE name = 'Acrílico' AND thickness = 3.00);

INSERT INTO laser_settings (key, value, description)
SELECT 'cutting_rate_per_minute', 8.00, 'Tarifa por minuto de corte láser en MXN'
WHERE NOT EXISTS (SELECT 1 FROM laser_settings WHERE key = 'cutting_rate_per_minute');

INSERT INTO laser_settings (key, value, description)
SELECT 'assembly_cost_per_piece', 25.00, 'Costo por pieza de ensamblaje en MXN'
WHERE NOT EXISTS (SELECT 1 FROM laser_settings WHERE key = 'assembly_cost_per_piece');

INSERT INTO laser_settings (key, value, description)
SELECT 'profit_margin', 0.50, 'Margen de utilidad (50%)'
WHERE NOT EXISTS (SELECT 1 FROM laser_settings WHERE key = 'profit_margin');

INSERT INTO laser_settings (key, value, description)
SELECT 'iva_rate', 0.16, 'Tasa de IVA'
WHERE NOT EXISTS (SELECT 1 FROM laser_settings WHERE key = 'iva_rate');

-- Habilitar RLS
ALTER TABLE laser_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (temporal)
DROP POLICY IF EXISTS "Allow public access to materials" ON laser_materials;
CREATE POLICY "Allow public access to materials" ON laser_materials FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public access to quotes" ON laser_quotes;
CREATE POLICY "Allow public access to quotes" ON laser_quotes FOR ALL USING (true);

DROP POLICY IF EXISTS "Allow public access to settings" ON laser_settings;
CREATE POLICY "Allow public access to settings" ON laser_settings FOR ALL USING (true);

-- Mostrar resumen
SELECT 'laser_materials' as table_name, COUNT(*) as records FROM laser_materials
UNION ALL
SELECT 'laser_quotes' as table_name, COUNT(*) as records FROM laser_quotes
UNION ALL
SELECT 'laser_settings' as table_name, COUNT(*) as records FROM laser_settings;