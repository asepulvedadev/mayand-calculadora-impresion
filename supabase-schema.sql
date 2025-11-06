-- Tabla de materiales para corte láser
CREATE TABLE laser_materials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  thickness DECIMAL(5,2) NOT NULL, -- en mm
  sheet_width DECIMAL(6,2) NOT NULL, -- en cm
  sheet_height DECIMAL(6,2) NOT NULL, -- en cm
  usable_width DECIMAL(6,2) NOT NULL, -- en cm
  usable_height DECIMAL(6,2) NOT NULL, -- en cm
  price_per_sheet DECIMAL(10,2) NOT NULL, -- en MXN
  color TEXT,
  finish TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones de corte láser
CREATE TABLE laser_quotes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID REFERENCES laser_materials(id) ON DELETE CASCADE,
  piece_width DECIMAL(6,2) NOT NULL, -- en cm
  piece_height DECIMAL(6,2) NOT NULL, -- en cm
  quantity INTEGER NOT NULL,
  cutting_minutes DECIMAL(6,2) NOT NULL,
  requires_assembly BOOLEAN DEFAULT false,
  assembly_cost_per_piece DECIMAL(8,2) DEFAULT 0,
  cutting_rate_per_minute DECIMAL(6,2) DEFAULT 8, -- $8 MXN por defecto
  sheets_needed INTEGER NOT NULL,
  material_cost DECIMAL(10,2) NOT NULL,
  cutting_cost DECIMAL(10,2) NOT NULL,
  assembly_cost DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  iva DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Configuraciones globales (para precios configurables)
CREATE TABLE laser_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar configuraciones por defecto
INSERT INTO laser_settings (key, value, description) VALUES
('cutting_rate_per_minute', 8.00, 'Tarifa por minuto de corte láser en MXN'),
('assembly_cost_per_piece', 25.00, 'Costo por pieza de ensamblaje en MXN'),
('iva_rate', 0.16, 'Tasa de IVA'),
('profit_margin', 0.50, 'Margen de utilidad (50%)');

-- Insertar algunos materiales de ejemplo
INSERT INTO laser_materials (name, thickness, sheet_width, sheet_height, usable_width, usable_height, price_per_sheet, color, finish) VALUES
('Acrílico', 3.00, 120.00, 240.00, 120.00, 80.00, 950.00, 'Transparente', 'Brillo'),
('Acrílico', 5.00, 120.00, 240.00, 120.00, 80.00, 1200.00, 'Transparente', 'Brillo'),
('MDF', 6.00, 120.00, 240.00, 120.00, 80.00, 450.00, 'Marrón', 'Natural'),
('Coroplast', 4.00, 120.00, 240.00, 120.00, 80.00, 320.00, 'Blanco', 'Mate');

-- Políticas RLS (Row Level Security) para seguridad
ALTER TABLE laser_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE laser_settings ENABLE ROW LEVEL SECURITY;

-- Políticas para materiales (acceso público por ahora)
CREATE POLICY "Allow public access to materials" ON laser_materials
  FOR ALL USING (true);

-- Políticas para cotizaciones (acceso público por ahora)
CREATE POLICY "Allow public access to quotes" ON laser_quotes
  FOR ALL USING (true);

-- Políticas para settings (acceso público por ahora)
CREATE POLICY "Allow public access to settings" ON laser_settings
  FOR ALL USING (true);