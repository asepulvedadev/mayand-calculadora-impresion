-- Script para crear la tabla laser_settings en Supabase
-- Ejecutar en el SQL Editor de Supabase Dashboard

CREATE TABLE IF NOT EXISTS laser_settings (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_laser_settings_key ON laser_settings(key);

-- Insertar valores por defecto
INSERT INTO laser_settings (key, value) VALUES
  ('cutting_rate_per_minute', 8.00),
  ('profit_margin', 0.50)
ON CONFLICT (key) DO NOTHING;

-- Crear trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_laser_settings_updated_at
    BEFORE UPDATE ON laser_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();