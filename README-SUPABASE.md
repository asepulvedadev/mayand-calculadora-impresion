# Configuración de Base de Datos - Supabase

## Pasos para configurar la base de datos:

### 1. Configurar variables de entorno

1. Copia el archivo `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edita `.env.local` y agrega tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

   **Dónde encontrar estas credenciales:**
   - Ve a tu proyecto en [Supabase](https://supabase.com)
   - 进入 Settings > API
   - Copia la Project URL y anon public key

### 2. Crear las tablas en Supabase

1. Ve a tu proyecto Supabase > SQL Editor
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el SQL Editor y ejecuta

Este script creará:
- Tabla `laser_materials` - Materiales para corte láser
- Tabla `laser_quotes` - Cotizaciones guardadas
- Tabla `laser_settings` - Configuraciones
- Tablas del catálogo (categorías, productos, etc.)
- Insertará materiales y productos de ejemplo
- Configurará políticas de seguridad (RLS)

### 3. Configurar el Storage para imágenes

1. Ve a tu proyecto Supabase > Storage > SQL Editor
2. Copia todo el contenido del archivo `supabase-storage.sql`
3. Pégalo en el SQL Editor y ejecuta

Este script creará:
- Bucket `product-images` - Para imágenes de productos
- Bucket `avatars` - Para avatares de usuarios
- Políticas de acceso público para lectura
- Políticas para usuarios autenticados (escritura)

**Nota:** El bucket `product-images` debe estar configurado como **público** para que las imágenes se muestren en el catálogo.

### 4. Verificar la conexión

1. Reinicia el servidor de desarrollo:
   ```bash
   bun run dev
   ```

2. Abre la aplicación en el navegador
3. Busca el botón "Test Supabase" en la esquina inferior derecha
4. Haz clic para verificar la conexión

---

## Uso del Storage de Imágenes

### Subir una imagen de producto

```typescript
import { uploadProductImage, getProductImageUrl } from '@/lib/storage'

// Subir imagen
const result = await uploadProductImage(file, 'Nombre del Producto')
if (result.success) {
  console.log('URL pública:', result.data.publicUrl)
  console.log('Path interno:', result.data.path)
}
```

### Obtener URL de imagen

```typescript
import { getProductImageUrl } from '@/lib/storage'

// URL simple
const url = getProductImageUrl('products/trofeo-acrilico/123456.jpg')

// URL con transformaciones (resize)
const urlOptimized = getProductImageUrl('products/trofeo-acrilico/123456.jpg', {
  width: 400,
  height: 400,
  resize: 'cover'
})
```

### Eliminar una imagen

```typescript
import { deleteProductImage } from '@/lib/storage'

const result = await deleteProductImage('products/trofeo-acrilico/123456.jpg')
if (result.success) {
  console.log('Imagen eliminada')
}
```

### Tipos de imagen permitidos

- `image/jpeg` (.jpg, .jpeg)
- `image/png` (.png)
- `image/gif` (.gif)
- `image/webp` (.webp)
- `image/svg+xml` (.svg)

### Tamaño máximo

5MB por archivo

---

## Solución de problemas comunes

### "relation does not exist"
Las tablas no fueron creadas. Ejecuta el script SQL en Supabase SQL Editor.

### "permission denied" o RLS errors
Las políticas de seguridad están bloqueando el acceso. Ejecuta el script SQL que incluye las políticas RLS.

### "invalid API key"
Verifica que las variables de entorno en `.env.local` sean correctas.

### Las tablas existen pero no hay datos
Ejecuta el script SQL - incluye INSERT para materiales de ejemplo.

### Las imágenes no se cargan
1. Verifica que el bucket esté configurado como público
2. Ejecuta el script `supabase-storage.sql` para crear las políticas
3. Verifica que las URLs sean públicas

---

## Estructura de las tablas

### laser_materials
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | TEXT | Nombre del material |
| thickness | DECIMAL | Grosor en mm |
| sheet_width | DECIMAL | Ancho de la lámina en cm |
| sheet_height | DECIMAL | Alto de la lámina en cm |
| usable_width | DECIMAL | Ancho útil en cm |
| usable_height | DECIMAL | Alto útil en cm |
| price_per_sheet | DECIMAL | Precio por lámina |
| color | TEXT | Color del material |
| finish | TEXT | Acabado del material |
| is_active | BOOLEAN | Si está disponible |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última modificación |

### laser_quotes
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| material_id | UUID | Referencia al material |
| piece_width | DECIMAL | Ancho de la pieza |
| piece_height | DECIMAL | Alto de la pieza |
| cutting_minutes | DECIMAL | Minutos de corte |
| sheets_needed | INTEGER | Láminas necesarias |
| material_cost | DECIMAL | Costo del material |
| cutting_cost | DECIMAL | Costo del corte |
| subtotal | DECIMAL | Subtotal |
| iva | DECIMAL | IVA |
| total | DECIMAL | Total |
| created_at | TIMESTAMP | Fecha de creación |

### catalog_products
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| name | TEXT | Nombre del producto |
| slug | TEXT | Slug URL amigable |
| description | TEXT | Descripción del producto |
| category_id | UUID | Categoría del producto |
| material_id | UUID | Material del producto |
| dimensions | TEXT | Dimensiones |
| thickness | TEXT | Grosor |
| price | DECIMAL | Precio |
| price_unit | TEXT | Unidad de precio |
| image_url | TEXT | URL de la imagen (del storage) |
| badge | TEXT | Etiqueta |
| badge_color | TEXT | Color de la etiqueta |
| stock | INTEGER | Stock (-1 = infinito) |
| is_active | BOOLEAN | Si está disponible |
| is_featured | BOOLEAN | Producto destacado |
| views | INTEGER | Veces visto |
| created_at | TIMESTAMP | Fecha de creación |
| updated_at | TIMESTAMP | Última modificación |

### catalog_product_images
| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | Identificador único |
| product_id | UUID | Referencia al producto |
| url | TEXT | URL de la imagen |
| alt | TEXT | Texto alternativo |
| sort_order | INTEGER | Orden de visualización |
| created_at | TIMESTAMP | Fecha de creación |

---

## Cambios de imagen_url en productos

Los productos ahora almacenan URLs del storage de Supabase:

```sql
-- Actualizar productos existentes con URLs de Supabase
UPDATE catalog_products 
SET image_url = 'products/trofeo-acrilico/123456.jpg'
WHERE id = 'uuid-del-producto';
```

**Nota:** El campo `image_url` almacena el path relativo (ej: `products/nombre/archivo.jpg`) y las funciones utilitarias generan automáticamente la URL pública completa.
