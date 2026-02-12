-- Habilitar RLS en todas las tablas (si no lo están ya)
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registros_diarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gastos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estado_cajas ENABLE ROW LEVEL SECURITY;

-- 1. Políticas para la tabla 'sedes'
-- Permitir lectura a todos (para que la app sepa qué sedes existen si es necesario, o cambiar a authenticated si es privado)
CREATE POLICY "Sedes visibles para todos" ON public.sedes
    FOR SELECT USING (true); -- Ojo: pon 'true' para público o 'auth.role() = ''authenticated''' para solo admin

-- Permitir inserción/actualización/borrado solo a usuarios autenticados
CREATE POLICY "Admin puede gestionar sedes" ON public.sedes
    FOR ALL USING (auth.role() = 'authenticated');


-- 2. Políticas para 'registros_diarios'
CREATE POLICY "Admin ve registros_diarios" ON public.registros_diarios
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gestiona registros_diarios" ON public.registros_diarios
    FOR ALL USING (auth.role() = 'authenticated');


-- 3. Políticas para 'gastos'
CREATE POLICY "Admin ve gastos" ON public.gastos
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gestiona gastos" ON public.gastos
    FOR ALL USING (auth.role() = 'authenticated');


-- 4. Políticas para 'compras'
CREATE POLICY "Admin ve compras" ON public.compras
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gestiona compras" ON public.compras
    FOR ALL USING (auth.role() = 'authenticated');


-- 5. Políticas para 'estado_cajas'
CREATE POLICY "Admin ve estado_cajas" ON public.estado_cajas
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Admin gestiona estado_cajas" ON public.estado_cajas
    FOR ALL USING (auth.role() = 'authenticated');
