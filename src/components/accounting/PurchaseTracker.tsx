import { useState } from 'react';
import { Plus, Check, Trash2, Pencil } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { AccountingState, TipoGasto, Compra } from '@/types/accounting';

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

interface Props {
  state: AccountingState;
  addCompra: (compra: Omit<Compra, 'id'>) => void;
  updateCompra: (id: string, updates: Partial<Compra>) => void;
  markCompraPaid: (id: string, fechaPago: string) => void;
  removeCompra: (id: string) => void;
  getPurchasesByType: (tipo?: TipoGasto, start?: string, end?: string) => Compra[];
  getPurchaseTotals: (tipo?: TipoGasto, start?: string, end?: string) => { total: number; pagado: number; pendiente: number; count: number };
}

const PurchaseTracker = ({ state, addCompra, updateCompra, markCompraPaid, removeCompra, getPurchasesByType, getPurchaseTotals }: Props) => {
  const [filterType, setFilterType] = useState<TipoGasto | ''>('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form fields
  const [tipo, setTipo] = useState<TipoGasto>('res');
  const [proveedor, setProveedor] = useState('');
  const [fechaCompra, setFechaCompra] = useState(new Date().toISOString().split('T')[0]);
  const [valor, setValor] = useState('');
  const [peso, setPeso] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const filtered = getPurchasesByType(filterType || undefined, startDate || undefined, endDate || undefined);
  const totals = getPurchaseTotals(filterType || undefined, startDate || undefined, endDate || undefined);

  const resetForm = () => {
    setProveedor('');
    setValor('');
    setPeso('');
    setDescripcion('');
    setEditingId(null);
    setTipo('res');
    setFechaCompra(new Date().toISOString().split('T')[0]);
    setShowForm(false);
  };

  const handleEdit = (compra: Compra) => {
    setEditingId(compra.id);
    setTipo(compra.tipo);
    setProveedor(compra.proveedor);
    setFechaCompra(compra.fechaCompra);
    setValor(compra.valor.toString());
    setPeso(compra.peso?.toString() || '');
    setDescripcion(compra.descripcion || '');
    setShowForm(true);
  };

  const handleSave = () => {
    if (!proveedor.trim() || !valor) {
      toast.error('Complete los campos obligatorios');
      return;
    }

    const compraData = {
      tipo,
      proveedor: proveedor.trim(),
      fechaCompra,
      valor: Number(valor),
      peso: peso ? Number(peso) : undefined,
      descripcion: descripcion.trim() || undefined,
      fuentePago: (tipo === 'salarios' || tipo === 'arriendos' || tipo === 'servicios') ? 'ahorro' : 'caja_total' as any,
    };

    if (editingId) {
      updateCompra(editingId, compraData);
    } else {
      addCompra({
        ...compraData,
        pagado: false, // Default for new
      });
    }

    resetForm();
  };

  const handlePay = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    markCompraPaid(id, today);
    toast.success('Compra marcada como pagada');
  };

  return (
    <div className="space-y-6">
      {/* Filters & Totals */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="flex flex-wrap items-end gap-4 mb-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Tipo</label>
            <select value={filterType} onChange={e => setFilterType(e.target.value as TipoGasto | '')}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
              <option value="">Todos</option>
              <option value="res">Res</option>
              <option value="pollo">Pollo</option>
              <option value="general">General</option>
              <option value="salarios">Salarios</option>
              <option value="arriendos">Arriendos</option>
              <option value="servicios">Servicios</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Desde</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Hasta</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors ml-auto">
            <Plus className="w-4 h-4" /> Nuevo Costo
          </button>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total', value: fmt(totals.total), color: 'text-foreground' },
            { label: 'Pagado', value: fmt(totals.pagado), color: 'text-success' },
            { label: 'Pendiente', value: fmt(totals.pendiente), color: 'text-destructive' },
          ].map(t => (
            <div key={t.label} className="p-3 rounded-lg bg-muted text-center">
              <p className="text-xs text-muted-foreground">{t.label}</p>
              <p className={`font-bold text-sm ${t.color}`}>{t.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border mt-4">
          <h3 className="font-semibold text-foreground mb-4">{editingId ? 'Editar Costo' : 'Nuevo Costo'}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Tipo de Gasto</label>
              <select value={tipo} onChange={e => setTipo(e.target.value as TipoGasto)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm">
                <option value="res">Res</option>
                <option value="pollo">Pollo</option>
                <option value="general">General</option>
                <option value="salarios">Salarios</option>
                <option value="arriendos">Arriendos</option>
                <option value="servicios">Servicios</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Proveedor</label>
              <input placeholder="Nombre proveedor" value={proveedor} onChange={e => setProveedor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fecha Compra</label>
              <input type="date" value={fechaCompra} onChange={e => setFechaCompra(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Valor ($)</label>
              <input type="number" placeholder="0" value={valor} onChange={e => setValor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Fuente de Pago</label>
              <select
                value={tipo === 'salarios' || tipo === 'arriendos' || tipo === 'servicios' ? 'ahorro' : 'caja_total'}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-muted-foreground text-sm cursor-not-allowed"
              >
                <option value="caja_total">Caja Total (Operativo)</option>
                <option value="ahorro">Ahorro (Administrativo)</option>
              </select>
              <p className="text-[10px] text-muted-foreground mt-1">
                {tipo === 'salarios' || tipo === 'arriendos' || tipo === 'servicios'
                  ? 'Se paga del Ahorro acumulado'
                  : 'Se resta de la Caja Total del día'}
              </p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Peso (kg) - Opcional</label>
              <input type="number" placeholder="0" value={peso} onChange={e => setPeso(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="text-xs text-muted-foreground mb-1 block">Descripción (Opcional)</label>
              <input placeholder="Detalles adicionales..." value={descripcion} onChange={e => setDescripcion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            </div>
          </div>
          <div className="flex justify-end mt-4 gap-2">
            <button onClick={resetForm}
              className="px-4 py-2 rounded-lg bg-muted text-muted-foreground text-sm font-medium hover:bg-muted/80 transition-colors">
              Cancelar
            </button>
            <button onClick={handleSave}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
              {editingId ? 'Actualizar Costo' : 'Registrar Costo'}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Costos ({filtered.length})</h3>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay costos registrados</p>
        ) : (
          <div className="space-y-2">
            {filtered.sort((a, b) => b.fechaCompra.localeCompare(a.fechaCompra)).map(c => (
              <div key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-3 border-b border-border last:border-0 hover:bg-muted/10 px-2 rounded-lg transition-colors group">
                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => handleEdit(c)}>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.tipo === 'res' ? 'bg-primary/10 text-primary' :
                    c.tipo === 'pollo' ? 'bg-gold/10 text-foreground' :
                      c.tipo === 'salarios' ? 'bg-blue-500/10 text-blue-700' :
                        c.tipo === 'arriendos' ? 'bg-purple-500/10 text-purple-700' :
                          c.tipo === 'servicios' ? 'bg-orange-500/10 text-orange-700' :
                            'bg-muted text-muted-foreground'
                    }`}>{c.tipo}</span>
                  <div>
                    <span className="text-sm font-medium text-foreground block">{c.proveedor}</span>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <span>{c.fechaCompra}</span>
                      {c.peso && <span>• {c.peso}kg</span>}
                      {c.descripcion && <span>• {c.descripcion}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-foreground">{fmt(c.valor)}</span>
                  {c.pagado ? (
                    <span className="bg-success/10 text-success px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" /> Pagado {c.fechaPago?.slice(5)}
                    </span>
                  ) : (
                    <button onClick={() => handlePay(c.id)}
                      className="px-3 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors">
                      Marcar Pagado
                    </button>
                  )}

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(c)}
                    className="text-primary/70 hover:text-primary p-2 rounded-full hover:bg-primary/10 transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  <ConfirmDialog
                    trigger={
                      <button className="text-destructive/60 hover:text-destructive p-2 rounded-full hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    }
                    title="¿Eliminar este costo?"
                    description={`Se eliminará el costo de "${c.proveedor}" por ${fmt(c.valor)}. Esta acción no se puede deshacer.`}
                    onConfirm={() => { removeCompra(c.id); toast.success('Costo eliminado'); }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseTracker;
