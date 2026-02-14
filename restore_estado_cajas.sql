-- Restaurar fila inicial de estado_cajas si no existe
INSERT INTO public.estado_cajas (caja_total, caja_menor, caja_registradora, ahorro)
SELECT 0, 200000, 200000, 0
WHERE NOT EXISTS (SELECT 1 FROM public.estado_cajas);
