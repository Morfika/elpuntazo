-- Migración: Renombrar compras a costos y agregar fuente_pago
-- Ejecuta esto en Supabase SQL Editor

-- 1. Agregar columna fuente_pago a compras
ALTER TABLE public.compras 
ADD COLUMN IF NOT EXISTS fuente_pago TEXT DEFAULT 'caja_total' 
CHECK (fuente_pago IN ('caja_total', 'ahorro'));

-- 2. Actualizar valores existentes según el tipo
-- Sueldos, arriendos y servicios vienen de ahorro
UPDATE public.compras 
SET fuente_pago = 'ahorro' 
WHERE tipo IN ('salarios', 'arriendos', 'servicios');

-- Res, pollo y general vienen de caja_total
UPDATE public.compras 
SET fuente_pago = 'caja_total' 
WHERE tipo IN ('res', 'pollo', 'general');

-- 3. Hacer la columna NOT NULL ahora que tiene valores
ALTER TABLE public.compras 
ALTER COLUMN fuente_pago SET NOT NULL;

-- Verificación
SELECT 
    tipo,
    fuente_pago,
    COUNT(*) as cantidad,
    SUM(valor) as total
FROM compras
GROUP BY tipo, fuente_pago
ORDER BY tipo, fuente_pago;
