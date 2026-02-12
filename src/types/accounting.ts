export type FuenteGasto = 'caja_menor' | 'caja_total' | 'caja_registradora';
export type TipoGasto = 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios';

export interface Gasto {
  id: string;
  fecha: string;
  nombre: string;
  monto: number;
  fuente: FuenteGasto;
  tipo: TipoGasto;
  notas?: string;
  registro_diario_id?: string | null;
}

export interface Compra {
  id: string;
  tipo: TipoGasto;
  proveedor: string;
  fechaCompra: string;
  fechaPago?: string;
  pagado: boolean;
  valor: number;
  peso?: number;
  descripcion?: string;
}

export interface RegistroDiario {
  id: string;
  fecha: string;
  ventaBruta: number;
  gastos: Gasto[];
  cerrado: boolean;
}

export interface Sede {
  id: string;
  nombre: string;
  direccion: string;
  telefono: string;
  horario: string;
  activa: boolean;
}

export interface EstadoCajas {
  cajaTotal: number;
  cajaMenor: number;
  cajaRegistradora: number;
  ahorro: number;
}

export interface AccountingState {
  cajas: EstadoCajas;
  registros: RegistroDiario[];
  compras: Compra[];
  sedes: Sede[];
}

