-- ============================================
-- CONFIGURACIÓN DE STORAGE PARA SUPABASE
-- IMPORTANTE: Primero crea el bucket desde la interfaz de Supabase
-- https://supabase.com/docs/storage
-- ============================================

-- ============================================
-- INSTRUCCIONES:
-- ============================================
-- 1. Ve a Supabase > Storage > New Bucket
-- 2. Crea un bucket llamado "product-images"
-- 3. Activa la opción "Public bucket"
-- 4. Luego ejecuta este script para las políticas RLS
-- ============================================

-- ============================================
-- 1. CREAR BUCKET (SI TIENES PERMISOS)
-- ============================================

-- Crear el bucket 'product-images' (público)
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================
-- 2. POLÍTICAS RLS - Acceso público completo
-- ============================================

-- Eliminar políticas existentes si hay conflictos
DROP POLICY IF EXISTS "Permitir acceso público a product-images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir insertar product-images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizar product-images" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminar product-images" ON storage.objects;

-- Política: Permitir acceso público para leer imágenes
CREATE POLICY "Permitir acceso público a product-images"
ON storage.objects
FOR SELECT
USING ( bucket_id = 'product-images' );

-- Política: Permitir inserción de imágenes (cualquier usuario puede subir)
CREATE POLICY "Permitir insertar product-images"
ON storage.objects
FOR INSERT
WITH CHECK ( bucket_id = 'product-images' );

-- Política: Permitir actualización de imágenes
CREATE POLICY "Permitir actualizar product-images"
ON storage.objects
FOR UPDATE
USING ( bucket_id = 'product-images' )
WITH CHECK ( bucket_id = 'product-images' );

-- Política: Permitir eliminación de imágenes
CREATE POLICY "Permitir eliminar product-images"
ON storage.objects
FOR DELETE
USING ( bucket_id = 'product-images' );

-- ============================================
-- NOTAS:
-- ============================================
-- Para subir imágenes, usa las funciones en src/lib/storage.ts:
-- 
-- import { uploadProductImage } from '@/lib/storage'
-- 
-- const result = await uploadProductImage(file, 'Nombre Producto')
-- if (result.success) {
--   console.log(result.data.publicUrl)
-- }
--
-- Las URLs públicas tendrán el formato:
-- https://[TU_PROYECTO].supabase.co/storage/v1/object/public/product-images/[PATH]
-- ============================================
