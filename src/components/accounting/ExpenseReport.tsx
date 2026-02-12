import { useState } from 'react';
import type { AccountingState, Gasto } from '@/types/accounting';

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

interface Props {
  state: AccountingState;
  getGroupedExpenses: (start?: string, end?: string) => { nombre: string; total: number; count: number; gastos: Gasto[] }[];
}

const ExpenseReport = ({ getGroupedExpenses }: Props) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);

  const groups = getGroupedExpenses(startDate || undefined, endDate || undefined);
  const grandTotal = groups.reduce((s, g) => s + g.total, 0);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <h3 className="font-semibold text-foreground mb-4">Filtrar por Fecha</h3>
        <div className="flex flex-wrap gap-4">
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
        </div>
      </div>

      {/* Grouped expenses */}
      <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Gastos Agrupados por Nombre</h3>
          <span className="text-sm font-bold text-foreground">Total: {fmt(grandTotal)}</span>
        </div>

        {groups.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No hay gastos registrados</p>
        ) : (
          <div className="space-y-2">
            {groups.map(group => (
              <div key={group.nombre} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpanded(expanded === group.nombre ? null : group.nombre)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground capitalize">{group.nombre}</span>
                    <span className="text-xs text-muted-foreground">({group.count} {group.count === 1 ? 'vez' : 'veces'})</span>
                  </div>
                  <span className="text-sm font-bold text-foreground">{fmt(group.total)}</span>
                </button>
                {expanded === group.nombre && (
                  <div className="border-t border-border bg-muted/30 p-3 space-y-1">
                    {group.gastos.map(g => (
                      <div key={g.id} className="flex justify-between text-xs text-muted-foreground">
                        <span>{g.fecha} — {g.nombre} <span className="capitalize">({g.fuente.replace(/_/g, ' ')})</span></span>
                        <span className="font-medium">{fmt(g.monto)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExpenseReport;
