-- Script SIMPLE para limpiar la base de datos de multi-sede
-- Ejecuta esto en Supabase SQL Editor

-- 1. Eliminar columnas sede_id (si existen)
ALTER TABLE public.registros_diarios DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE public.gastos DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE public.compras DROP COLUMN IF EXISTS sede_id CASCADE;
ALTER TABLE public.estado_cajas DROP COLUMN IF EXISTS sede_id CASCADE;

-- 2. Asegurar que solo haya un registro en estado_cajas
DELETE FROM estado_cajas WHERE id NOT IN (
    SELECT id FROM estado_cajas ORDER BY updated_at DESC LIMIT 1
);

-- 3. Verificar que todo esté bien
SELECT 'Tablas limpias - Verificación:' as status;
SELECT COUNT(*) as total_estado_cajas FROM estado_cajas;
SELECT COUNT(*) as total_registros FROM registros_diarios;
SELECT COUNT(*) as total_gastos FROM gastos;
SELECT COUNT(*) as total_compras FROM compras;
