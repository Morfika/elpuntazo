// Tipos generados para Supabase
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            sedes: {
                Row: {
                    id: string
                    nombre: string
                    direccion: string
                    telefono: string
                    horario: string
                    activa: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nombre: string
                    direccion: string
                    telefono: string
                    horario: string
                    activa?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nombre?: string
                    direccion?: string
                    telefono?: string
                    horario?: string
                    activa?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            registros_diarios: {
                Row: {
                    id: string
                    sede_id: string
                    fecha: string
                    venta_bruta: number
                    cerrado: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sede_id: string
                    fecha: string
                    venta_bruta?: number
                    cerrado?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sede_id?: string
                    fecha?: string
                    venta_bruta?: number
                    cerrado?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            gastos: {
                Row: {
                    id: string
                    sede_id: string
                    registro_diario_id: string | null
                    fecha: string
                    nombre: string
                    monto: number
                    fuente: 'caja_menor' | 'caja_total' | 'caja_registradora'
                    tipo: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    notas: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sede_id: string
                    registro_diario_id?: string | null
                    fecha: string
                    nombre: string
                    monto: number
                    fuente: 'caja_menor' | 'caja_total' | 'caja_registradora'
                    tipo: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    notas?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sede_id?: string
                    registro_diario_id?: string | null
                    fecha?: string
                    nombre?: string
                    monto?: number
                    fuente?: 'caja_menor' | 'caja_total' | 'caja_registradora'
                    tipo?: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    notas?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            compras: {
                Row: {
                    id: string
                    sede_id: string
                    tipo: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    proveedor: string
                    fecha_compra: string
                    fecha_pago: string | null
                    pagado: boolean
                    valor: number
                    peso: number | null
                    descripcion: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sede_id: string
                    tipo: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    proveedor: string
                    fecha_compra: string
                    fecha_pago?: string | null
                    pagado?: boolean
                    valor: number
                    peso?: number | null
                    descripcion?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sede_id?: string
                    tipo?: 'res' | 'pollo' | 'general' | 'salarios' | 'arriendos' | 'servicios'
                    proveedor?: string
                    fecha_compra?: string
                    fecha_pago?: string | null
                    pagado?: boolean
                    valor?: number
                    peso?: number | null
                    descripcion?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            estado_cajas: {
                Row: {
                    id: string
                    sede_id: string
                    caja_total: number
                    caja_menor: number
                    caja_registradora: number
                    ahorro: number
                    updated_at: string
                }
                Insert: {
                    id?: string
                    sede_id: string
                    caja_total?: number
                    caja_menor?: number
                    caja_registradora?: number
                    ahorro?: number
                    updated_at?: string
                }
                Update: {
                    id?: string
                    sede_id?: string
                    caja_total?: number
                    caja_menor?: number
                    caja_registradora?: number
                    ahorro?: number
                    updated_at?: string
                }
            }
        }
    }
}
