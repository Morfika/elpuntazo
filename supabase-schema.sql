-- ============================================
-- SCHEMA DE BASE DE DATOS PARA EL PUNTAZO DIGITAL
-- ============================================
-- Ejecuta este script completo en el SQL Editor de Supabase
-- Dashboard > SQL Editor > New Query > Pega todo este código > Run
-- ============================================

-- 1. TABLA: sedes
CREATE TABLE IF NOT EXISTS sedes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  direccion TEXT NOT NULL,
  telefono TEXT NOT NULL,
  horario TEXT NOT NULL,
  activa BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABLA: registros_diarios
CREATE TABLE IF NOT EXISTS registros_diarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fecha DATE NOT NULL UNIQUE,
  venta_bruta DECIMAL(12,2) NOT NULL DEFAULT 0,
  cerrado BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA: gastos
CREATE TABLE IF NOT EXISTS gastos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registro_diario_id UUID REFERENCES registros_diarios(id) ON DELETE CASCADE,
  fecha DATE NOT NULL,
  nombre TEXT NOT NULL,
  monto DECIMAL(12,2) NOT NULL,
  fuente TEXT NOT NULL CHECK (fuente IN ('caja_menor', 'caja_total', 'caja_registradora')),
  tipo TEXT NOT NULL CHECK (tipo IN ('res', 'pollo', 'general', 'salarios', 'arriendos', 'servicios')),
  notas TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABLA: compras
CREATE TABLE IF NOT EXISTS compras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL CHECK (tipo IN ('res', 'pollo', 'general', 'salarios', 'arriendos', 'servicios')),
  proveedor TEXT NOT NULL,
  fecha_compra DATE NOT NULL,
  fecha_pago DATE,
  pagado BOOLEAN DEFAULT false,
  valor DECIMAL(12,2) NOT NULL,
  peso DECIMAL(10,2),
  descripcion TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA: estado_cajas
CREATE TABLE IF NOT EXISTS estado_cajas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  caja_total DECIMAL(12,2) DEFAULT 0,
  caja_menor DECIMAL(12,2) DEFAULT 200000,
  caja_registradora DECIMAL(12,2) DEFAULT 200000,
  ahorro DECIMAL(12,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar registro inicial de estado de cajas
INSERT INTO estado_cajas (caja_total, caja_menor, caja_registradora, ahorro)
SELECT 0, 200000, 200000, 0
WHERE NOT EXISTS (SELECT 1 FROM estado_cajas LIMIT 1);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_gastos_fecha ON gastos(fecha);
CREATE INDEX IF NOT EXISTS idx_gastos_registro ON gastos(registro_diario_id);
CREATE INDEX IF NOT EXISTS idx_compras_fecha ON compras(fecha_compra);
CREATE INDEX IF NOT EXISTS idx_compras_pagado ON compras(pagado);
CREATE INDEX IF NOT EXISTS idx_registros_fecha ON registros_diarios(fecha DESC);

-- ============================================
-- FUNCIONES Y TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_sedes_updated_at ON sedes;
CREATE TRIGGER update_sedes_updated_at 
  BEFORE UPDATE ON sedes
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_registros_updated_at ON registros_diarios;
CREATE TRIGGER update_registros_updated_at 
  BEFORE UPDATE ON registros_diarios
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_gastos_updated_at ON gastos;
CREATE TRIGGER update_gastos_updated_at 
  BEFORE UPDATE ON gastos
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_compras_updated_at ON compras;
CREATE TRIGGER update_compras_updated_at 
  BEFORE UPDATE ON compras
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cajas_updated_at ON estado_cajas;
CREATE TRIGGER update_cajas_updated_at 
  BEFORE UPDATE ON estado_cajas
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- DATOS INICIALES
-- ============================================

INSERT INTO sedes (nombre, direccion, telefono, horario, activa)
SELECT 'El Puntazo - Sede Centro', 'Carrera 15 #45-67, Centro', '300 123 4567', 'Lunes a Sábado: 6:00 AM - 8:00 PM', true
WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE nombre = 'El Puntazo - Sede Centro');

INSERT INTO sedes (nombre, direccion, telefono, horario, activa)
SELECT 'El Puntazo - Sede Norte', 'Avenida 68 #23-45, Norte', '301 987 6543', 'Lunes a Domingo: 7:00 AM - 7:00 PM', true
WHERE NOT EXISTS (SELECT 1 FROM sedes WHERE nombre = 'El Puntazo - Sede Norte');
