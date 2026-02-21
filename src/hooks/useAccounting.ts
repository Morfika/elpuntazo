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

  // Helper: obtiene el ID de estado_cajas SIEMPRE desde el servidor (evita stale state)
  const getCajasId = async (): Promise<string | null> => {
    const { data, error } = await supabase
      .from('estado_cajas')
      .select('id')
      .limit(1)
      .maybeSingle();
    if (error || !data) {
      console.error('getCajasId failed:', error);
      return null;
    }
    return data.id;
  };

  // Helper: lee los valores actuales de cajas DESDE EL SERVIDOR en el momento del ajuste
  // Evita race conditions al usar state.cajas que puede estar desactualizado
  const adjustCajas = async (delta: {
    caja_total?: number;
    ahorro?: number;
    caja_menor?: number;
    caja_registradora?: number;
  }): Promise<boolean> => {
    const cajasId = await getCajasId();
    if (!cajasId) {
      toast.error('Error: no se encontró el registro de cajas');
      return false;
    }

    // Leer valores actuales del servidor (no del estado React)
    const { data: current, error: readError } = await supabase
      .from('estado_cajas')
      .select('caja_total, ahorro, caja_menor, caja_registradora')
      .eq('id', cajasId)
      .single();

    if (readError || !current) {
      toast.error('Error al leer cajas: ' + readError?.message);
      return false;
    }

    const updates: Record<string, number> = {};
    if (delta.caja_total !== undefined) updates.caja_total = Number(current.caja_total) + delta.caja_total;
    if (delta.ahorro !== undefined) updates.ahorro = Number(current.ahorro) + delta.ahorro;
    if (delta.caja_menor !== undefined) updates.caja_menor = Number(current.caja_menor) + delta.caja_menor;
    if (delta.caja_registradora !== undefined) updates.caja_registradora = Number(current.caja_registradora) + delta.caja_registradora;

    const { error: updateError } = await supabase
      .from('estado_cajas')
      .update(updates)
      .eq('id', cajasId);

    if (updateError) {
      toast.error('Error al actualizar cajas: ' + updateError.message);
      return false;
    }
    return true;
  };

  // Helper: establece valores absolutos en cajas (para cierre/reapertura de día)
  const setCajas = async (values: {
    caja_total?: number;
    ahorro?: number;
    caja_menor?: number;
    caja_registradora?: number;
  }): Promise<boolean> => {
    const cajasId = await getCajasId();
    if (!cajasId) {
      toast.error('Error: no se encontró el registro de cajas');
      return false;
    }

    const updates: Record<string, number> = {};
    if (values.caja_total !== undefined) updates.caja_total = values.caja_total;
    if (values.ahorro !== undefined) updates.ahorro = values.ahorro;
    if (values.caja_menor !== undefined) updates.caja_menor = values.caja_menor;
    if (values.caja_registradora !== undefined) updates.caja_registradora = values.caja_registradora;

    const { error } = await supabase
      .from('estado_cajas')
      .update(updates)
      .eq('id', cajasId);

    if (error) {
      toast.error('Error al actualizar cajas: ' + error.message);
      return false;
    }
    return true;
  };

  // Cargar datos iniciales
  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Cargar estado de cajas
      let { data: cajasData } = await supabase
        .from('estado_cajas')
        .select('*')
        .limit(1)
        .maybeSingle();

      // Si no existe, crear uno por defecto (Auto-healing)
      if (!cajasData) {
        const { data: newCajas, error: createError } = await supabase
          .from('estado_cajas')
          .insert([{
            caja_total: 0,
            caja_menor: CAJA_MENOR_TARGET,
            caja_registradora: CAJA_REGISTRADORA_TARGET,
            ahorro: 0,
          }])
          .select()
          .single();

        if (!createError && newCajas) {
          cajasData = newCajas;
          toast.success('Se restauró el estado de cajas automáticamente');
        }
      }

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
    // ⬆️ OPTIMISTIC UPDATE: mostrar el gasto de inmediato con ID temporal
    const tempId = `temp-${Date.now()}`;
    const gastoOptimista: Gasto = { ...gasto, id: tempId, fecha };
    setState(prev => {
      const existingReg = prev.registros.find(r => r.fecha === fecha);
      if (existingReg) {
        return {
          ...prev,
          registros: prev.registros.map(r =>
            r.fecha === fecha ? { ...r, gastos: [...r.gastos, gastoOptimista] } : r
          ),
        };
      }
      // Si no existe el registro, crearlo optimistamente
      return {
        ...prev,
        registros: [...prev.registros, {
          id: tempId,
          fecha,
          ventaBruta: 0,
          cerrado: false,
          gastos: [gastoOptimista],
        }],
      };
    });

    // Asegurar que existe el registro diario en la BD
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
      await loadData(); // Revertir estado optimista
      return;
    }

    // Reemplazar ID temporal con el real
    if (newGasto) {
      setState(prev => ({
        ...prev,
        registros: prev.registros.map(r =>
          r.fecha === fecha
            ? { ...r, gastos: r.gastos.map(g => g.id === tempId ? { ...g, id: newGasto.id } : g) }
            : r
        ),
      }));
    }
  }, [loadData]);

  const removeGasto = useCallback(async (fecha: string, gastoId: string) => {
    // ⬆️ OPTIMISTIC UPDATE
    setState(prev => ({
      ...prev,
      registros: prev.registros.map(r =>
        r.fecha === fecha ? { ...r, gastos: r.gastos.filter(g => g.id !== gastoId) } : r
      ),
    }));

    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', gastoId);

    if (error) {
      console.error('Error removing gasto:', error);
      await loadData(); // Revertir
    }
  }, [loadData]);

  const closeDay = useCallback(async (fecha: string, ventaBruta: number) => {
    const record = state.registros.find(r => r.fecha === fecha);
    const gastos = record?.gastos || [];

    const gastosCajaMenor = gastos.filter(g => g.fuente === 'caja_menor').reduce((sum, g) => sum + g.monto, 0);
    const gastosCajaTotal = gastos.filter(g => g.fuente === 'caja_total').reduce((sum, g) => sum + g.monto, 0);
    const gastosRegistradora = gastos.filter(g => g.fuente === 'caja_registradora').reduce((sum, g) => sum + g.monto, 0);

    const ventaNeta = ventaBruta - gastosCajaMenor - gastosRegistradora;
    const aporteCajaTotal = ventaNeta - AHORRO_DIARIO;

    // Actualizar o crear registro diario
    const { error: registroError } = await supabase
      .from('registros_diarios')
      .upsert([{ fecha, venta_bruta: ventaBruta, cerrado: true }], { onConflict: 'fecha' });

    if (registroError) {
      console.error('Error closing day:', registroError);
      toast.error('Error al cerrar el día: ' + registroError.message);
      return;
    }

    // Ajustar cajas usando deltas (lee valores actuales del servidor)
    // aporteCajaTotal entra a caja_total, menos gastosCajaTotal que ya se pagaron
    const ok = await adjustCajas({
      caja_total: aporteCajaTotal - gastosCajaTotal,
      ahorro: AHORRO_DIARIO,
      // Restaurar caja_menor y registradora a su target (los gastos del día las vaciaron)
      // Usamos setCajas para estos valores absolutos
    });
    if (!ok) return;

    // Resetear caja_menor y registradora a targets absolutos
    const cajasId = await getCajasId();
    if (cajasId) {
      await supabase
        .from('estado_cajas')
        .update({ caja_menor: CAJA_MENOR_TARGET, caja_registradora: CAJA_REGISTRADORA_TARGET })
        .eq('id', cajasId);
    }

    await loadData();
  }, [state, loadData]);

  // Nueva función para reabrir un día
  const reopenDay = useCallback(async (fecha: string) => {
    const record = state.registros.find(r => r.fecha === fecha);
    if (!record || !record.cerrado) return;

    const gastos = record.gastos || [];
    const gastosCajaMenor = gastos.filter(g => g.fuente === 'caja_menor').reduce((sum, g) => sum + g.monto, 0);
    const gastosCajaTotal = gastos.filter(g => g.fuente === 'caja_total').reduce((sum, g) => sum + g.monto, 0);
    const gastosRegistradora = gastos.filter(g => g.fuente === 'caja_registradora').reduce((sum, g) => sum + g.monto, 0);
    const ventaNeta = record.ventaBruta - gastosCajaMenor - gastosRegistradora;
    const aporteCajaTotal = ventaNeta - AHORRO_DIARIO;

    // Revertir: usar deltas inversos (leer desde servidor)
    const ok = await adjustCajas({
      caja_total: -(aporteCajaTotal - gastosCajaTotal),
      ahorro: -AHORRO_DIARIO,
    });
    if (!ok) return;

    // Marcar día como abierto
    const { error } = await supabase
      .from('registros_diarios')
      .update({ cerrado: false })
      .eq('fecha', fecha);

    if (error) {
      toast.error('Error al reabrir el día: ' + error.message);
      return;
    }

    await loadData();
    toast.success('Día reabierto y saldos revertidos correctamente');
  }, [state, loadData]);

  // Eliminar completamente un registro diario (y revertir cajas si estaba cerrado)
  const deleteDay = useCallback(async (fecha: string) => {
    const record = state.registros.find(r => r.fecha === fecha);
    if (!record) return;

    if (record.cerrado) {
      const gastos = record.gastos || [];
      const gastosCajaMenor = gastos.filter(g => g.fuente === 'caja_menor').reduce((sum, g) => sum + g.monto, 0);
      const gastosCajaTotal = gastos.filter(g => g.fuente === 'caja_total').reduce((sum, g) => sum + g.monto, 0);
      const gastosRegistradora = gastos.filter(g => g.fuente === 'caja_registradora').reduce((sum, g) => sum + g.monto, 0);
      const ventaNeta = record.ventaBruta - gastosCajaMenor - gastosRegistradora;
      const aporteCajaTotal = ventaNeta - AHORRO_DIARIO;

      const ok = await adjustCajas({
        caja_total: -(aporteCajaTotal - gastosCajaTotal),
        ahorro: -AHORRO_DIARIO,
      });
      if (!ok) return;
    }

    await supabase.from('gastos').delete().eq('fecha', fecha);

    const { error } = await supabase
      .from('registros_diarios')
      .delete()
      .eq('fecha', fecha);

    if (error) {
      toast.error('Error al eliminar el registro: ' + error.message);
      return;
    }

    await loadData();
    toast.success('Registro del día eliminado correctamente');
  }, [state, loadData]);

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
    // ⬆️ OPTIMISTIC UPDATE con ID temporal
    const tempId = `temp-${Date.now()}`;
    setState(prev => ({
      ...prev,
      compras: [{ ...compra, id: tempId }, ...prev.compras],
      cajas: compra.pagado
        ? {
          ...prev.cajas,
          ...(compra.fuentePago === 'ahorro'
            ? { ahorro: prev.cajas.ahorro - compra.valor }
            : { cajaTotal: prev.cajas.cajaTotal - compra.valor }),
        }
        : prev.cajas,
    }));

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

    if (error || !data) {
      toast.error('Error al guardar el costo: ' + error?.message);
      await loadData(); // Revertir estado optimista
      return;
    }

    // Reemplazar ID temporal con el real
    setState(prev => ({
      ...prev,
      compras: prev.compras.map(c => c.id === tempId ? { ...c, id: data.id } : c),
    }));

    // Si fue creada como pagada, ajustar cajas en el servidor
    if (compra.pagado) {
      const fuente = compra.fuentePago || 'caja_total';
      await adjustCajas(
        fuente === 'ahorro' ? { ahorro: -data.valor } : { caja_total: -data.valor }
      );
    }
  }, [loadData]);

  const markCompraPaid = useCallback(async (id: string, fechaPago: string) => {
    const compra = state.compras.find(c => c.id === id);
    if (!compra || compra.pagado) return;

    // ⬆️ OPTIMISTIC UPDATE: marcar como pagada y descontar de caja al instante
    setState(prev => ({
      ...prev,
      compras: prev.compras.map(c => c.id === id ? { ...c, pagado: true, fechaPago } : c),
      cajas: {
        ...prev.cajas,
        ...(compra.fuentePago === 'ahorro'
          ? { ahorro: prev.cajas.ahorro - compra.valor }
          : { cajaTotal: prev.cajas.cajaTotal - compra.valor }),
      },
    }));

    // Escritura en servidor en segundo plano
    const { error: compraError } = await supabase
      .from('compras')
      .update({ pagado: true, fecha_pago: fechaPago })
      .eq('id', id);

    if (compraError) {
      toast.error('Error al marcar como pagado: ' + compraError.message);
      await loadData(); // Revertir
      return;
    }

    const fuente = compra.fuentePago || 'caja_total';
    const ok = await adjustCajas(
      fuente === 'ahorro' ? { ahorro: -compra.valor } : { caja_total: -compra.valor }
    );
    if (!ok) {
      await supabase.from('compras').update({ pagado: false, fecha_pago: null }).eq('id', id);
      await loadData();
    }
  }, [state.compras, loadData]);

  const unmarkCompraPaid = useCallback(async (id: string) => {
    const compra = state.compras.find(c => c.id === id);
    if (!compra || !compra.pagado) return;

    // ⬆️ OPTIMISTIC UPDATE: revertir pago al instante
    setState(prev => ({
      ...prev,
      compras: prev.compras.map(c => c.id === id ? { ...c, pagado: false, fechaPago: undefined } : c),
      cajas: {
        ...prev.cajas,
        ...(compra.fuentePago === 'ahorro'
          ? { ahorro: prev.cajas.ahorro + compra.valor }
          : { cajaTotal: prev.cajas.cajaTotal + compra.valor }),
      },
    }));

    // Actualizar en BD
    const { error } = await supabase
      .from('compras')
      .update({ pagado: false, fecha_pago: null })
      .eq('id', id);

    if (error) {
      toast.error('Error al desmarcar el pago: ' + error.message);
      await loadData(); // Revertir
      return;
    }

    // Devolver el valor a la caja en el servidor
    const fuente = compra.fuentePago || 'caja_total';
    const ok = await adjustCajas(
      fuente === 'ahorro' ? { ahorro: compra.valor } : { caja_total: compra.valor }
    );
    if (!ok) {
      await supabase.from('compras').update({ pagado: true, fecha_pago: compra.fechaPago }).eq('id', id);
      await loadData();
    }
  }, [state.compras, loadData]);

  const removeCompra = useCallback(async (id: string) => {
    const compra = state.compras.find(c => c.id === id);

    // ⬆️ OPTIMISTIC UPDATE: quitar de la lista y devolver a caja si estaba pagada
    setState(prev => ({
      ...prev,
      compras: prev.compras.filter(c => c.id !== id),
      cajas: compra?.pagado
        ? {
          ...prev.cajas,
          ...(compra.fuentePago === 'ahorro'
            ? { ahorro: prev.cajas.ahorro + compra.valor }
            : { cajaTotal: prev.cajas.cajaTotal + compra.valor }),
        }
        : prev.cajas,
    }));

    if (compra?.pagado) {
      const fuente = compra.fuentePago || 'caja_total';
      await adjustCajas(
        fuente === 'ahorro' ? { ahorro: compra.valor } : { caja_total: compra.valor }
      );
    }

    const { error } = await supabase.from('compras').delete().eq('id', id);
    if (error) {
      toast.error('Error al eliminar costo: ' + error.message);
      await loadData(); // Revertir
    }
  }, [state.compras, loadData]);

  const updateCompra = useCallback(async (id: string, updates: Partial<Compra>) => {
    const oldCompra = state.compras.find(c => c.id === id);
    if (!oldCompra) return;

    const newCompra = { ...oldCompra, ...updates };

    // Si estaba pagada y cambió valor o fuente, ajustar cajas con deltas
    if (oldCompra.pagado) {
      const oldFuente = oldCompra.fuentePago || 'caja_total';
      const newFuente = newCompra.fuentePago || 'caja_total';

      if (oldCompra.valor !== newCompra.valor || oldFuente !== newFuente) {
        // Revertir antiguo
        await adjustCajas(oldFuente === 'ahorro' ? { ahorro: oldCompra.valor } : { caja_total: oldCompra.valor });
        // Aplicar nuevo
        await adjustCajas(newFuente === 'ahorro' ? { ahorro: -newCompra.valor } : { caja_total: -newCompra.valor });
      }
    }

    const { error } = await supabase
      .from('compras')
      .update({
        tipo: newCompra.tipo,
        proveedor: newCompra.proveedor,
        fecha_compra: newCompra.fechaCompra,
        valor: newCompra.valor,
        peso: newCompra.peso,
        descripcion: newCompra.descripcion,
        fuente_pago: newCompra.fuentePago,
      })
      .eq('id', id);

    if (error) {
      toast.error('Error actualizando costo: ' + error.message);
      return;
    }

    toast.success('Costo actualizado correctamente');
    await loadData();
  }, [state.compras, loadData]);

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
    const ok = await setCajas({
      caja_total: updates.cajaTotal,
      caja_menor: updates.cajaMenor,
      caja_registradora: updates.cajaRegistradora,
      ahorro: updates.ahorro,
    });
    if (ok) await loadData();
  }, [loadData]);

  /**
   * Recalcula los saldos de cajas desde cero usando los datos reales.
   * Fórmula correcta:
   *   caja_total = Σ(aportes de días cerrados) - Σ(compras pagadas fuente=caja_total)
   *   ahorro     = Σ(ahorro diario de días cerrados) - Σ(compras pagadas fuente=ahorro)
   *   caja_menor y registradora = siempre CAJA_MENOR_TARGET / CAJA_REGISTRADORA_TARGET
   */
  const reconciliarCajas = useCallback(async () => {
    const registros = state.registros;
    const compras = state.compras;

    // Contribución de cada día cerrado a caja_total y ahorro
    let cajaTotalCalculado = 0;
    let ahorroCalculado = 0;

    for (const reg of registros.filter(r => r.cerrado)) {
      const gastosCajaMenor = reg.gastos.filter(g => g.fuente === 'caja_menor').reduce((s, g) => s + g.monto, 0);
      const gastosCajaTotal = reg.gastos.filter(g => g.fuente === 'caja_total').reduce((s, g) => s + g.monto, 0);
      const gastosRegistradora = reg.gastos.filter(g => g.fuente === 'caja_registradora').reduce((s, g) => s + g.monto, 0);

      const ventaNeta = reg.ventaBruta - gastosCajaMenor - gastosRegistradora;
      const aporteCajaTotal = ventaNeta - AHORRO_DIARIO;

      // aporteCajaTotal va a caja; gastosCajaTotal fueron gastados DE caja ese día
      cajaTotalCalculado += aporteCajaTotal - gastosCajaTotal;
      ahorroCalculado += AHORRO_DIARIO;
    }

    // Restar compras pagadas de cada fuente
    for (const c of compras.filter(c => c.pagado)) {
      if (c.fuentePago === 'ahorro') {
        ahorroCalculado -= c.valor;
      } else {
        cajaTotalCalculado -= c.valor;
      }
    }

    const ok = await setCajas({
      caja_total: cajaTotalCalculado,
      ahorro: ahorroCalculado,
      caja_menor: CAJA_MENOR_TARGET,
      caja_registradora: CAJA_REGISTRADORA_TARGET,
    });

    if (ok) {
      await loadData();
      toast.success(
        `Cajas recalculadas — Caja Total: ${new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(cajaTotalCalculado)}`
      );
    }
  }, [state, loadData]);

  return {
    state,
    loading,
    addSede, updateSede, removeSede,
    addGasto, removeGasto, closeDay, reopenDay, updateDayVentaBruta, deleteDay,
    addCompra, markCompraPaid, unmarkCompraPaid, removeCompra, updateCompra,
    getGroupedExpenses, getPurchasesByType, getPurchaseTotals, getDaySummary,
    updateCajas, reconciliarCajas,
  };
};
