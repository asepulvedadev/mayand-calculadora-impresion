# Solución de Problemas - Supabase

## Error: "Error saving quote: {}"

Este error indica que hay un problema con la conexión o configuración de Supabase.

### Pasos para diagnosticar:

1. **Verificar variables de entorno** en `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_aqui
   ```

2. **Probar conexión**:
   - Abre la aplicación en el navegador
   - Busca el botón "Test Supabase" en la esquina inferior derecha
   - Haz clic para verificar la conexión y tablas

3. **Verificar tablas en Supabase**:
   - Ve a tu proyecto Supabase → SQL Editor
   - Ejecuta el script `check-tables.sql` (este verifica y crea tablas si no existen)
   - O ejecuta manualmente: `SELECT * FROM laser_materials LIMIT 1;`
   - Si no existe, ejecuta el script `supabase-schema.sql`

4. **Actualizar esquema** (si ya tienes datos):
   - Ejecuta el script `update-laser-schema.sql`

5. **Verificar RLS (Row Level Security)**:
   - En Supabase → Authentication → Policies
   - Asegúrate de que las políticas permitan acceso público

### Comandos útiles:

```bash
# Reiniciar el servidor de desarrollo
bun run dev

# Ver logs en la consola del navegador
# Abre DevTools → Console
```

### Si el problema persiste:

1. **Verifica credenciales**: Asegúrate de que URL y KEY sean correctos
2. **Ejecuta el schema**: Copia y pega `supabase-schema.sql` en SQL Editor
3. **Revisa RLS**: Ve a Authentication → Policies y verifica permisos
4. **Test de conexión**: Usa el botón "Test Supabase" en la app
5. **Logs detallados**: Abre DevTools → Console para ver errores específicos

### Posibles errores comunes:

- **"relation does not exist"**: Las tablas no se crearon
- **"permission denied"**: RLS bloqueando acceso
- **"invalid API key"**: Credenciales incorrectas
- **CORS error**: Configuración de Supabase

### Comandos de diagnóstico:

```javascript
// En consola del navegador
testSupabase() // Prueba completa de conexión y tablas

testInsert()   // Prueba inserción manual para identificar el error exacto

// Verificar variables
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('SUPABASE_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')
```

### Testing desde consola del navegador:

```javascript
// Probar conexión
testSupabase()

// Ver variables de entorno
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Missing')