import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import type { AccountingState, Gasto, Compra, Sede, TipoGasto, RegistroDiario } from '@/types/accounting';

export const CAJA_MENOR_TARGET = 200000;
export const CAJA_REGISTRADORA_TARGET = 200000;
export const AHORRO_DIARIO = 200000;

export const defaultSedes: Sede[] = [
  {
    id: '1',
    nombre: 'El Puntazo - Sede Centro',
    direccion: 'Carrera 15 #45-67, Centro',
    telefono: '300 123 4567',
    horario: 'Lunes a Sábado: 6:00 AM - 8:00 PM',
    activa: true,
  },
  {
    id: '2',
    nombre: 'El Puntazo - Sede Norte',
    direccion: 'Avenida 68 #23-45, Norte',
    telefono: '301 987 6543',
    horario: 'Lunes a Domingo: 7:00 AM - 7:00 PM',
    activa: true,
  },
];

export const useAccounting = () => {
  const [state, setState] = useState<AccountingState>({
    cajas: {
      cajaTotal: 0,
      cajaMenor: CAJA_MENOR_TARGET,
      cajaRegistradora: CAJA_REGISTRADORA_TARGET,
      ahorro: 0,
    },
    registros: [],
    compras: [],
    sedes: [],
  });
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar estado de cajas
      const { data: cajasData } = await supabase
        .from('estado_cajas')
        .select('*')
        .single();

      // Cargar sedes
      const { data: sedesData } = await supabase
        .from('sedes')
        .select('*')
        .order('nombre');

      // Cargar registros diarios con gastos
      const { data: registrosData } = await supabase
        .from('registros_diarios')
        .select('*')
        .order('fecha', { ascending: false });

      // Cargar todos los gastos
      const { data: gastosData } = await supabase
        .from('gastos')
        .select('*')
        .order('fecha', { ascending: false });

      // Cargar compras
      const { data: comprasData } = await supabase
        .from('compras')
        .select('*')
        .order('fecha_compra', { ascending: false });

      // Agrupar gastos por registro diario
      const registrosConGastos: RegistroDiario[] = (registrosData || []).map(reg => ({
        id: reg.id,
        fecha: reg.fecha,
        ventaBruta: Number(reg.venta_bruta),
        cerrado: reg.cerrado,
        gastos: (gastosData || [])
          .filter(g => g.fecha === reg.fecha)
          .map(g => ({
            id: g.id,
            fecha: g.fecha,
            nombre: g.nombre,
            monto: Number(g.monto),
            fuente: g.fuente,
            tipo: g.tipo,
            notas: g.notas || undefined,
            registro_diario_id: g.registro_diario_id,
          })),
      }));

      setState({
        cajas: cajasData ? {
          cajaTotal: Number(cajasData.caja_total),
          cajaMenor: Number(cajasData.caja_menor),
          cajaRegistradora: Number(cajasData.caja_registradora),
          ahorro: Number(cajasData.ahorro),
        } : {
          cajaTotal: 0,
          cajaMenor: CAJA_MENOR_TARGET,
          cajaRegistradora: CAJA_REGISTRADORA_TARGET,
          ahorro: 0,
        },
        sedes: (sedesData || []).map(s => ({
          id: s.id,
          nombre: s.nombre,
          direccion: s.direccion,
          telefono: s.telefono,
          horario: s.horario,
          activa: s.activa,
        })),
        registros: registrosConGastos,
        compras: (comprasData || []).map(c => ({
          id: c.id,
          tipo: c.tipo,
          proveedor: c.proveedor,
          fechaCompra: c.fecha_compra,
          fechaPago: c.fecha_pago || undefined,
          pagado: c.pagado,
          valor: Number(c.valor),
          peso: c.peso ? Number(c.peso) : undefined,
          descripcion: c.descripcion || undefined,
          fuentePago: (c.fuente_pago as any) || 'caja_total',
        })),
      });
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ===== LOCATIONS =====
  const addSede = useCallback(async (sede: Omit<Sede, 'id'>) => {
    const { data, error } = await supabase
      .from('sedes')
      .insert([sede])
      .select()
      .single();

    if (error) {
      console.error('Error adding sede:', error);
      return;
    }

    if (data) {
      setState(prev => ({
        ...prev,
        sedes: [...prev.sedes, {
          id: data.id,
          nombre: data.nombre,
          direccion: data.direccion,
          telefono: data.telefono,
          horario: data.horario,
          activa: data.activa,
        }],
      }));
    }
  }, []);

  const updateSede = useCallback(async (id: string, updates: Partial<Sede>) => {
    const { error } = await supabase
      .from('sedes')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating sede:', error);
      return;
    }

    setState(prev => ({
      ...prev,
      sedes: prev.sedes.map(s => s.id === id ? { ...s, ...updates } : s),
    }));
  }, []);

  const removeSede = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('sedes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing sede:', error);
      return;
    }

    setState(prev => ({
      ...prev,
      sedes: prev.sedes.filter(s => s.id !== id),
    }));
  }, []);

  // ===== DAILY RECORDS =====
  const addGasto = useCallback(async (fecha: string, gasto: Omit<Gasto, 'id' | 'fecha'>) => {
    // Primero asegurar que existe el registro diario
    let { data: registro } = await supabase
      .from('registros_diarios')
      .select('id')
      .eq('fecha', fecha)
      .single();

    if (!registro) {
      const { data: newRegistro } = await supabase
        .from('registros_diarios')
        .insert([{ fecha, venta_bruta: 0, cerrado: false }])
        .select()
        .single();
      registro = newRegistro;
    }

    // Insertar el gasto
    const { data: newGasto, error } = await supabase
      .from('gastos')
      .insert([{
        fecha,
        nombre: gasto.nombre,
        monto: gasto.monto,
        fuente: gasto.fuente,
        tipo: gasto.tipo,
        notas: gasto.notas,
        registro_diario_id: registro?.id,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding gasto:', error);
      return;
    }

    if (newGasto) {
      await loadData();
    }
  }, [loadData]);

  const removeGasto = useCallback(async (fecha: string, gastoId: string) => {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', gastoId);

    if (error) {
      console.error('Error removing gasto:', error);
      return;
    }

    await loadData();
  }, [loadData]);

  const closeDay = useCallback(async (fecha: string, ventaBruta: number) => {
    const record = state.registros.find(r => r.fecha === fecha);
    const gastos = record?.gastos || [];

    const gastosCajaMenor = gastos
      .filter(g => g.fuente === 'caja_menor')
      .reduce((sum, g) => sum + g.monto, 0);
    const gastosCajaTotal = gastos
      .filter(g => g.fuente === 'caja_total')
      .reduce((sum, g) => sum + g.monto, 0);
    const gastosRegistradora = gastos
      .filter(g => g.fuente === 'caja_registradora')
      .reduce((sum, g) => sum + g.monto, 0);

    const ventaNeta = ventaBruta - gastosCajaMenor - gastosRegistradora;
    const aporteCajaTotal = ventaNeta - AHORRO_DIARIO;

    // Actualizar o crear registro diario
    const { error: registroError } = await supabase
      .from('registros_diarios')
      .upsert([{
        fecha,
        venta_bruta: ventaBruta,
        cerrado: true,
      }], { onConflict: 'fecha' });

    if (registroError) {
      console.error('Error closing day:', registroError);
      return;
    }

    // Actualizar estado de cajas
    const { error: cajasError } = await supabase
      .from('estado_cajas')
      .update({
        caja_total: state.cajas.cajaTotal - gastosCajaTotal + aporteCajaTotal,
        caja_menor: CAJA_MENOR_TARGET,
        caja_registradora: CAJA_REGISTRADORA_TARGET,
        ahorro: state.cajas.ahorro + AHORRO_DIARIO,
      })
      .eq('id', (await supabase.from('estado_cajas').select('id').single()).data?.id || '');

    if (cajasError) {
      console.error('Error updating cajas:', cajasError);
      return;
    }

    await loadData();
  }, [state, loadData]);

  // Nueva función para reabrir un día
  const reopenDay = useCallback(async (fecha: string) => {
    const { error } = await supabase
      .from('registros_diarios')
      .update({ cerrado: false })
      .eq('fecha', fecha);

    if (error) {
      console.error('Error reopening day:', error);
      return;
    }

    await loadData();
  }, [loadData]);

  // Nueva función para actualizar venta bruta
  const updateDayVentaBruta = useCallback(async (fecha: string, ventaBruta: number) => {
    const { error } = await supabase
      .from('registros_diarios')
      .update({ venta_bruta: ventaBruta })
      .eq('fecha', fecha);

    if (error) {
      console.error('Error updating venta bruta:', error);
      return;
    }

    await loadData();
  }, [loadData]);

  // ===== PURCHASES =====
  const addCompra = useCallback(async (compra: Omit<Compra, 'id'>) => {
    const { data, error } = await supabase
      .from('compras')
      .insert([{
        tipo: compra.tipo,
        proveedor: compra.proveedor,
        fecha_compra: compra.fechaCompra,
        fecha_pago: compra.fechaPago,
        pagado: compra.pagado,
        valor: compra.valor,
        peso: compra.peso,
        descripcion: compra.descripcion,
        fuente_pago: compra.fuentePago,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding compra:', error);
      toast.error('Error al guardar el costo: ' + error.message);
      return;
    }

    // Si se creó como pagada, descontar inmediatamente
    if (compra.pagado && data) {
      const updates: any = {};
      const fuente = (data.fuente_pago as any) || 'caja_total'; // Fallback

      if (fuente === 'ahorro') {
        updates.ahorro = state.cajas.ahorro - data.valor;
      } else {
        updates.caja_total = state.cajas.cajaTotal - data.valor;
      }

      await supabase
        .from('estado_cajas')
        .update(updates)
        .eq('id', (await supabase.from('estado_cajas').select('id').single()).data?.id || '');
    }

    if (data) {
      await loadData();
    }
  }, [state, loadData]); // Added state dependency

  const markCompraPaid = useCallback(async (id: string, fechaPago: string) => {
    const compra = state.compras.find(c => c.id === id);
    if (!compra || compra.pagado) return;

    const { error: compraError } = await supabase
      .from('compras')
      .update({ pagado: true, fecha_pago: fechaPago })
      .eq('id', id);

    if (compraError) {
      console.error('Error marking compra as paid:', compraError);
      return;
    }

    // Actualizar caja correspondiente
    const updates: any = {};
    if (compra.fuentePago === 'ahorro') {
      updates.ahorro = state.cajas.ahorro - compra.valor;
    } else {
      updates.caja_total = state.cajas.cajaTotal - compra.valor;
    }

    const { error: cajasError } = await supabase
      .from('estado_cajas')
      .update(updates)
      .eq('id', (await supabase.from('estado_cajas').select('id').single()).data?.id || '');

    if (cajasError) {
      console.error('Error updating cajas:', cajasError);
      return;
    }

    await loadData();
  }, [state, loadData]);

  const removeCompra = useCallback(async (id: string) => {
    const compra = state.compras.find(c => c.id === id);

    // Si estaba pagada, devolver el dinero
    if (compra?.pagado) {
      const updates: any = {};
      if (compra.fuentePago === 'ahorro') {
        updates.ahorro = state.cajas.ahorro + compra.valor;
      } else {
        updates.caja_total = state.cajas.cajaTotal + compra.valor;
      }

      await supabase
        .from('estado_cajas')
        .update(updates)
        .eq('id', (await supabase.from('estado_cajas').select('id').single()).data?.id || '');
    }

    const { error } = await supabase
      .from('compras')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error removing compra:', error);
      return;
    }

    await loadData();
  }, [state, loadData]);

  // ===== REPORTS =====
  const normalizeExpenseName = (name: string): string => {
    return name.toLowerCase().trim().replace(/s$/, '').replace(/\s+grande.*$/, '').replace(/\s+/g, ' ');
  };

  const getGroupedExpenses = useCallback((startDate?: string, endDate?: string) => {
    const allGastos = state.registros
      .filter(r => {
        if (startDate && r.fecha < startDate) return false;
        if (endDate && r.fecha > endDate) return false;
        return true;
      })
      .flatMap(r => r.gastos);

    const groups: Record<string, { nombre: string; total: number; count: number; gastos: Gasto[] }> = {};
    allGastos.forEach(gasto => {
      const key = normalizeExpenseName(gasto.nombre);
      if (!groups[key]) {
        groups[key] = { nombre: gasto.nombre, total: 0, count: 0, gastos: [] };
      }
      groups[key].total += gasto.monto;
      groups[key].count += 1;
      groups[key].gastos.push(gasto);
    });

    return Object.values(groups).sort((a, b) => b.total - a.total);
  }, [state.registros]);

  const getPurchasesByType = useCallback((tipo?: TipoGasto, startDate?: string, endDate?: string) => {
    return state.compras.filter(c => {
      if (tipo && c.tipo !== tipo) return false;
      if (startDate && c.fechaCompra < startDate) return false;
      if (endDate && c.fechaCompra > endDate) return false;
      return true;
    });
  }, [state.compras]);

  const getPurchaseTotals = useCallback((tipo?: TipoGasto, startDate?: string, endDate?: string) => {
    const filtered = getPurchasesByType(tipo, startDate, endDate);
    return {
      total: filtered.reduce((sum, c) => sum + c.valor, 0),
      pagado: filtered.filter(c => c.pagado).reduce((sum, c) => sum + c.valor, 0),
      pendiente: filtered.filter(c => !c.pagado).reduce((sum, c) => sum + c.valor, 0),
      count: filtered.length,
    };
  }, [getPurchasesByType]);

  const getDaySummary = useCallback((fecha: string) => {
    const record = state.registros.find(r => r.fecha === fecha);
    if (!record) return null;
    const gastosCajaMenor = record.gastos.filter(g => g.fuente === 'caja_menor').reduce((s, g) => s + g.monto, 0);
    const gastosCajaTotal = record.gastos.filter(g => g.fuente === 'caja_total').reduce((s, g) => s + g.monto, 0);
    const gastosRegistradora = record.gastos.filter(g => g.fuente === 'caja_registradora').reduce((s, g) => s + g.monto, 0);

    // NO restar CAJA_REGISTRADORA_TARGET (el usuario ya ingresa la venta neta de base)
    const ventaNeta = record.ventaBruta - gastosCajaMenor - gastosRegistradora;

    return {
      ventaBruta: record.ventaBruta,
      ventaNeta,
      gastosCajaMenor,
      gastosCajaTotal,
      gastosRegistradora,
      totalGastos: gastosCajaMenor + gastosCajaTotal + gastosRegistradora,
      reposicionCajaMenor: gastosCajaMenor,
      ahorroDelDia: AHORRO_DIARIO,
      aporteCajaTotal: ventaNeta - AHORRO_DIARIO,
      cerrado: record.cerrado,
    };
  }, [state.registros]);

  const updateCajas = useCallback(async (updates: Partial<AccountingState['cajas']>) => {
    const cajasId = (await supabase.from('estado_cajas').select('id').single()).data?.id;
    if (!cajasId) return;

    const dbUpdates: any = {};
    if (updates.cajaTotal !== undefined) dbUpdates.caja_total = updates.cajaTotal;
    if (updates.cajaMenor !== undefined) dbUpdates.caja_menor = updates.cajaMenor;
    if (updates.cajaRegistradora !== undefined) dbUpdates.caja_registradora = updates.cajaRegistradora;
    if (updates.ahorro !== undefined) dbUpdates.ahorro = updates.ahorro;

    const { error } = await supabase
      .from('estado_cajas')
      .update(dbUpdates)
      .eq('id', cajasId);

    if (error) {
      console.error('Error updating cajas:', error);
      return;
    }

    await loadData();
  }, [loadData]);

  return {
    state,
    loading,
    addSede, updateSede, removeSede,
    addGasto, removeGasto, closeDay, reopenDay, updateDayVentaBruta,
    addCompra, markCompraPaid, removeCompra,
    getGroupedExpenses, getPurchasesByType, getPurchaseTotals, getDaySummary,
    updateCajas,
  };
};
