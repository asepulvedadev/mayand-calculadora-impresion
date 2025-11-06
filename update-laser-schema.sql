-- Actualizaciones para el sistema de corte láser
-- Ejecutar después del schema inicial

-- Actualizar configuraciones existentes y agregar nueva
UPDATE laser_settings SET value = 25.00 WHERE key = 'assembly_cost_per_piece';
INSERT INTO laser_settings (key, value, description) VALUES
('profit_margin', 0.50, 'Margen de utilidad (50%)')
ON CONFLICT (key) DO NOTHING;

-- Actualizar dimensiones de láminas (120x240 cm = 28,800 cm²)
UPDATE laser_materials SET
  sheet_height = 240.00
WHERE sheet_height = 200.00;

-- Agregar campos adicionales a la tabla de cotizaciones si es necesario
-- (Los campos ya existen en el schema original)