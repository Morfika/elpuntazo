import { useState } from 'react';
import { Plus, Trash2, CheckCircle, AlertCircle, Edit, Lock, Unlock } from 'lucide-react';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import type { AccountingState, FuenteGasto, TipoGasto } from '@/types/accounting';
import { CAJA_REGISTRADORA_TARGET, AHORRO_DIARIO } from '@/hooks/useAccounting';

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

interface Props {
  state: AccountingState;
  addGasto: (fecha: string, gasto: { nombre: string; monto: number; fuente: FuenteGasto; tipo: TipoGasto; notas?: string }) => void;
  removeGasto: (fecha: string, gastoId: string) => void;
  closeDay: (fecha: string, ventaBruta: number) => void;
  reopenDay: (fecha: string) => void;
  updateDayVentaBruta: (fecha: string, ventaBruta: number) => void;
  getDaySummary: (fecha: string) => any;
}

const DailyRegister = ({ state, addGasto, removeGasto, closeDay, reopenDay, updateDayVentaBruta, getDaySummary }: Props) => {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [nombre, setNombre] = useState('');
  const [monto, setMonto] = useState('');
  const [fuente, setFuente] = useState<FuenteGasto>('caja_menor');
  const [tipo, setTipo] = useState<TipoGasto>('general');
  const [ventaBruta, setVentaBruta] = useState('');
  const [editingVentaBruta, setEditingVentaBruta] = useState(false);

  const record = state.registros.find(r => r.fecha === fecha);
  const gastos = record?.gastos || [];
  const cerrado = record?.cerrado || false;

  const handleAddGasto = () => {
    if (!nombre.trim() || !monto) return;
    addGasto(fecha, {
      nombre: nombre.trim(),
      monto: Number(monto),
      fuente,
      tipo,
    });
    setNombre('');
    setMonto('');
    toast.success('Gasto registrado');
  };

  const handleCloseDay = () => {
    const vb = Number(ventaBruta);
    if (!vb || vb <= 0) {
      toast.error('Ingrese la venta bruta del día');
      return;
    }
    closeDay(fecha, vb);
    setVentaBruta('');
    toast.success('Día cerrado exitosamente');
  };

  const handleReopenDay = () => {
    reopenDay(fecha);
    toast.success('Día reabierto - Ahora puedes editarlo');
  };

  const handleUpdateVentaBruta = () => {
    const vb = Number(ventaBruta);
    if (!vb || vb <= 0) {
      toast.error('Ingrese una venta bruta válida');
      return;
    }
    updateDayVentaBruta(fecha, vb);
    setEditingVentaBruta(false);
    setVentaBruta('');
    toast.success('Venta bruta actualizada');
  };

  const summary = getDaySummary(fecha);

  return (
    <div className="space-y-6">
      {/* Date selector */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Fecha</label>
            <input
              type="date"
              value={fecha}
              onChange={e => setFecha(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            />
          </div>
          {cerrado && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-success/10 text-success text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Día cerrado
              </div>
              <ConfirmDialog
                trigger={
                  <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 text-sm font-medium transition-colors">
                    <Unlock className="w-4 h-4" />
                    Reabrir día
                  </button>
                }
                title="¿Reabrir este día?"
                description="Esto te permitirá editar los gastos y la venta bruta. Podrás volver a cerrarlo después."
                confirmLabel="Reabrir"
                variant="default"
                onConfirm={handleReopenDay}
              />
            </div>
          )}
        </div>
      </div>

      {/* Warning for closed day */}
      {cerrado && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-1">
                Este día está cerrado
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-300">
                Para editar gastos o modificar la venta bruta, primero debes reabrir el día usando el botón de arriba.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add expense form */}
      {!cerrado && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Registrar Gasto</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              placeholder="Nombre (ej: Quesos, Bolsas)"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            />
            <input
              type="number"
              placeholder="Monto"
              value={monto}
              onChange={e => setMonto(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            />
            <select
              value={fuente}
              onChange={e => setFuente(e.target.value as FuenteGasto)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option value="caja_menor">Caja Menor</option>
              <option value="caja_total">Caja Total</option>
              <option value="caja_registradora">Registradora</option>
            </select>
            <select
              value={tipo}
              onChange={e => setTipo(e.target.value as TipoGasto)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm"
            >
              <option value="general">General</option>
              <option value="res">Res</option>
              <option value="pollo">Pollo</option>
              <option value="salarios">Salarios</option>
              <option value="arriendos">Arriendos</option>
              <option value="servicios">Servicios</option>
            </select>
            <button
              onClick={handleAddGasto}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" /> Agregar
            </button>
          </div>
        </div>
      )}

      {/* Expenses list */}
      {gastos.length > 0 && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground mb-4">Gastos del día ({gastos.length})</h3>
          <div className="space-y-2">
            {gastos.map(g => (
              <div key={g.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${g.tipo === 'res' ? 'bg-primary/10 text-primary' :
                    g.tipo === 'pollo' ? 'bg-gold/10 text-foreground' :
                      g.tipo === 'salarios' ? 'bg-blue-500/10 text-blue-700' :
                        g.tipo === 'arriendos' ? 'bg-purple-500/10 text-purple-700' :
                          g.tipo === 'servicios' ? 'bg-orange-500/10 text-orange-700' :
                            'bg-muted text-muted-foreground'
                    }`}>{g.tipo}</span>
                  <span className="text-sm font-medium text-foreground">{g.nombre}</span>
                  <span className="text-xs text-muted-foreground capitalize">({g.fuente.replace(/_/g, ' ')})</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-foreground">{fmt(g.monto)}</span>
                  {!cerrado && (
                    <ConfirmDialog
                      trigger={
                        <button className="text-destructive/60 hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      }
                      title="¿Eliminar este gasto?"
                      description={`Se eliminará "${g.nombre}" por ${fmt(g.monto)}. Esta acción no se puede deshacer.`}
                      onConfirm={() => removeGasto(fecha, g.id)}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Close day */}
      {!cerrado && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-accent" />
            Cerrar Día
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Ingrese la venta bruta (lo que marcó la factura/POS) para cerrar y reconciliar las cajas.
          </p>
          <div className="flex flex-wrap gap-3 items-end">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Venta Bruta del Día</label>
              <input
                type="number"
                placeholder="Ej: 2590000"
                value={ventaBruta}
                onChange={e => setVentaBruta(e.target.value)}
                className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm w-48"
              />
            </div>
            <button
              onClick={handleCloseDay}
              className="px-6 py-2 rounded-lg bg-success text-success-foreground text-sm font-medium hover:bg-success/90 transition-colors"
            >
              Cerrar y Reconciliar
            </button>
          </div>
        </div>
      )}

      {/* Day summary */}
      {summary && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Resumen del Día</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            {[
              { label: 'Venta Bruta', value: fmt(summary.ventaBruta) },
              { label: 'Venta Neta', value: fmt(summary.ventaNeta) },
              { label: 'Gastos Caja Menor', value: fmt(summary.gastosCajaMenor) },
              { label: 'Gastos Caja Total', value: fmt(summary.gastosCajaTotal) },
              { label: 'Gastos Registradora', value: fmt(summary.gastosRegistradora) },
              { label: 'Ahorro del Día', value: fmt(summary.ahorroDelDia) },
              { label: 'Reposición C. Menor', value: fmt(summary.reposicionCajaMenor) },
              { label: 'Aporte Caja Total', value: fmt(summary.aporteCajaTotal) },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg bg-muted">
                <p className="text-muted-foreground text-xs mb-1">{item.label}</p>
                <p className="font-bold text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyRegister;
