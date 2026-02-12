# Migración a Supabase - El Puntazo Digital

Este proyecto ha sido migrado de localStorage a Supabase para gestión de datos en la nube.

## 🚀 Configuración Inicial

### 1. Crear Proyecto en Supabase

1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto
4. Anota la **URL del proyecto** y la **anon key**

### 2. Ejecutar el Schema SQL

1. En tu proyecto de Supabase, ve a **SQL Editor**
2. Haz clic en **New Query**
3. Copia todo el contenido del archivo `supabase-schema.sql`
4. Pégalo en el editor y haz clic en **Run**
5. Verifica que todas las tablas se crearon correctamente en **Table Editor**

### 3. Configurar Variables de Entorno

1. Copia el archivo `.env.example` a `.env`:
   ```bash
   copy .env.example .env
   ```

2. Edita el archivo `.env` y reemplaza con tus credenciales:
   ```env
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_ANON_KEY=tu-anon-key-aqui
   ```

   **Dónde encontrar estas credenciales:**
   - Ve a tu proyecto en Supabase
   - Click en el ícono de **Settings** (⚙️)
   - Click en **API**
   - Copia **Project URL** → `VITE_SUPABASE_URL`
   - Copia **anon public** key → `VITE_SUPABASE_ANON_KEY`

### 4. Instalar Dependencias y Ejecutar

```bash
npm install
npm run dev
```

## ✨ Nuevas Funcionalidades

### Edición de Días Cerrados

Ahora puedes editar registros diarios que ya fueron cerrados:

1. **Reabrir un día**: Click en el botón "Reabrir día" junto al estado "Día cerrado"
2. **Editar gastos**: Una vez reabierto, puedes agregar o eliminar gastos
3. **Editar venta bruta**: Click en "Editar Venta Bruta" en el resumen del día
4. **Volver a cerrar**: Cuando termines, cierra el día nuevamente

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **`sedes`**: Información de las sedes/locales
- **`registros_diarios`**: Registro de ventas y cierre de día
- **`gastos`**: Gastos diarios asociados a registros
- **`compras`**: Compras a proveedores (pagadas o pendientes)
- **`estado_cajas`**: Estado actual de las cajas (singleton)

### Campos Importantes

Todos los registros incluyen:
- `id`: UUID único generado automáticamente
- `created_at`: Fecha de creación
- `updated_at`: Fecha de última actualización (se actualiza automáticamente)

## 🔒 Seguridad

⚠️ **IMPORTANTE**: El archivo `.env` contiene credenciales sensibles y **NO** debe subirse a Git.

Ya está configurado en `.gitignore` para evitar esto.

## 🐛 Solución de Problemas

### Error: "Faltan las variables de entorno de Supabase"

- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que las variables tienen el prefijo `VITE_`
- Reinicia el servidor de desarrollo (`npm run dev`)

### Los datos no se guardan

- Verifica que ejecutaste el script SQL completo en Supabase
- Revisa la consola del navegador para ver errores
- Verifica que las credenciales en `.env` son correctas

### Error de conexión a Supabase

- Verifica que tu proyecto de Supabase está activo
- Verifica que la URL y la key son correctas
- Revisa tu conexión a internet

## 📝 Notas de Migración

### Datos Anteriores

Los datos que tenías en localStorage **no se migran automáticamente**. Si necesitas conservarlos:

1. Abre la consola del navegador (F12)
2. Ve a Application > Local Storage
3. Busca la key `elpuntazo_accounting`
4. Copia los datos
5. Contacta al desarrollador para ayuda con la migración

### Autenticación

La autenticación sigue siendo simple con contraseña por ahora. En el futuro se puede migrar a Supabase Auth para mayor seguridad.

## 🎯 Próximos Pasos

- [ ] Configurar Row Level Security (RLS) en Supabase
- [ ] Migrar autenticación a Supabase Auth
- [ ] Agregar respaldos automáticos
- [ ] Implementar sincronización en tiempo real

## 📞 Soporte

Si tienes problemas con la configuración, revisa:
1. La documentación de Supabase: https://supabase.com/docs
2. Los logs de la consola del navegador
3. Los logs del servidor de desarrollo
