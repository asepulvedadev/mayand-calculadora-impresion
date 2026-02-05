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
-- 2. POLÍTICAS RLS - Acceso público de lectura
-- ============================================

-- Política: Permitir acceso público para leer imágenes
-- Esta política permite que cualquier persona vea las imágenes
CREATE POLICY "Permitir acceso público a product-images"
ON storage.objects
FOR SELECT
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
