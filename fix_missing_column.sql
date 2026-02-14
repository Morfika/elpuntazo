-- Script de corrección rápida para agregar columna faltante
ALTER TABLE public.compras 
ADD COLUMN IF NOT EXISTS fuente_pago TEXT DEFAULT 'caja_total';
