-- 1. Crear tabla de sedes
CREATE TABLE IF NOT EXISTS public.sedes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nombre TEXT NOT NULL,
    direccion TEXT,
    telefono TEXT,
    horario TEXT,
    activa BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en sedes
ALTER TABLE public.sedes ENABLE ROW LEVEL SECURITY;

-- Política de lectura para sedes (permitir a todos ver las sedes por ahora, o restringir a autenticados)
CREATE POLICY "Sedes visibles para usuarios autenticados" ON public.sedes
    FOR SELECT USING (auth.role() = 'authenticated');

-- 2. Bloque anónimo para migración de datos
DO $$
DECLARE
    default_sede_id UUID;
BEGIN
    -- Insertar sede por defecto si no existe ninguna
    IF NOT EXISTS (SELECT 1 FROM public.sedes) THEN
        INSERT INTO public.sedes (nombre, direccion, activa)
        VALUES ('Sede Principal', 'Calle Principal #123', true)
        RETURNING id INTO default_sede_id;
    ELSE
        SELECT id INTO default_sede_id FROM public.sedes ORDER BY created_at ASC LIMIT 1;
    END IF;

    -- 3. Agregar columna sede_id a tablas existentes

    -- Tabla registros_diarios
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'registros_diarios' AND column_name = 'sede_id') THEN
        ALTER TABLE public.registros_diarios ADD COLUMN sede_id UUID REFERENCES public.sedes(id);
        UPDATE public.registros_diarios SET sede_id = default_sede_id WHERE sede_id IS NULL;
        ALTER TABLE public.registros_diarios ALTER COLUMN sede_id SET NOT NULL;
    END IF;

    -- Tabla gastos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gastos' AND column_name = 'sede_id') THEN
        ALTER TABLE public.gastos ADD COLUMN sede_id UUID REFERENCES public.sedes(id);
        UPDATE public.gastos SET sede_id = default_sede_id WHERE sede_id IS NULL;
        ALTER TABLE public.gastos ALTER COLUMN sede_id SET NOT NULL;
    END IF;

    -- Tabla compras
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'compras' AND column_name = 'sede_id') THEN
        ALTER TABLE public.compras ADD COLUMN sede_id UUID REFERENCES public.sedes(id);
        UPDATE public.compras SET sede_id = default_sede_id WHERE sede_id IS NULL;
        ALTER TABLE public.compras ALTER COLUMN sede_id SET NOT NULL;
    END IF;

    -- Tabla estado_cajas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'estado_cajas' AND column_name = 'sede_id') THEN
        ALTER TABLE public.estado_cajas ADD COLUMN sede_id UUID REFERENCES public.sedes(id);
        UPDATE public.estado_cajas SET sede_id = default_sede_id WHERE sede_id IS NULL;
        ALTER TABLE public.estado_cajas ALTER COLUMN sede_id SET NOT NULL;
    END IF;

END $$;
