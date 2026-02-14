import { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AccountingState } from '@/types/accounting';
import { CAJA_MENOR_TARGET, CAJA_REGISTRADORA_TARGET, AHORRO_DIARIO } from '@/hooks/useAccounting';

interface Props {
  state: AccountingState;
}

const fmt = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(n);

const CashOverview = ({ state }: Props) => {
  const { cajas, registros } = state;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayRecord = registros.find(r => r.fecha === todayStr);
  const todayGastos = todayRecord?.gastos || [];
  const pendingTotal = todayGastos.reduce((s, g) => s + g.monto, 0);

  const boxes = [
    { label: 'Caja Total', value: cajas.cajaTotal, icon: DollarSign, color: 'bg-primary/10 text-primary' },
    { label: 'Caja Menor', value: cajas.cajaMenor, target: CAJA_MENOR_TARGET, icon: TrendingDown, color: 'bg-accent/10 text-accent' },
    { label: 'Registradora', value: cajas.cajaRegistradora, target: CAJA_REGISTRADORA_TARGET, icon: TrendingUp, color: 'bg-info/10 text-info' },
    { label: 'Ahorro', value: cajas.ahorro, icon: Calendar, color: 'bg-success/10 text-success' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {boxes.map((box, i) => (
          <motion.div
            key={box.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-card rounded-2xl p-5 shadow-card border border-border"
          >
            <div className={`w-10 h-10 rounded-xl ${box.color} flex items-center justify-center mb-3`}>
              <box.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground font-medium mb-1">{box.label}</p>
            <p className="text-xl font-bold text-foreground">{fmt(box.value)}</p>
            {box.target !== undefined && box.value < box.target && (
              <p className="text-xs text-destructive mt-1">Faltan {fmt(box.target - box.value)}</p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Today's pending */}
      {todayGastos.length > 0 && !todayRecord?.cerrado && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h3 className="font-semibold text-foreground mb-3">Gastos pendientes de hoy</h3>
          <div className="space-y-2">
            {todayGastos.map(g => (
              <div key={g.id} className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0">
                <div>
                  <span className="font-medium text-foreground">{g.nombre}</span>
                  <span className="ml-2 text-xs text-muted-foreground capitalize">({g.fuente.replace('_', ' ')})</span>
                </div>
                <span className="font-semibold text-foreground">{fmt(g.monto)}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 font-bold text-foreground">
              <span>Total pendiente</span>
              <span>{fmt(pendingTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent closed days */}
      {/* Recent closed days */}
      {registros.filter(r => r.cerrado).length > 0 && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border overflow-hidden">
          <h3 className="font-semibold text-foreground mb-4">Últimos cierres</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Fecha</th>
                  <th className="px-4 py-3 text-right">
                    Venta Bruta
                    <span className="block text-[10px] normal-case opacity-70">Sin restar gastos</span>
                  </th>
                  <th className="px-4 py-3 text-right">
                    Venta Neta
                    <span className="block text-[10px] normal-case opacity-70">Menos gastos del día</span>
                  </th>
                  <th className="px-4 py-3 text-right rounded-r-lg">
                    Aporte Caja Total
                    <span className="block text-[10px] normal-case opacity-70">Menos $200k ahorro</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {registros.filter(r => r.cerrado).slice(-5).reverse().map(r => {
                  const gastosCM = r.gastos.filter(g => g.fuente === 'caja_menor').reduce((s, g) => s + g.monto, 0);
                  const gastosReg = r.gastos.filter(g => g.fuente === 'caja_registradora').reduce((s, g) => s + g.monto, 0);

                  // Corrección: NO restar base de registradora
                  const ventaNeta = r.ventaBruta - gastosCM - gastosReg;
                  const aporte = ventaNeta - AHORRO_DIARIO;

                  return (
                    <tr key={r.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-medium">{r.fecha}</td>
                      <td className="px-4 py-3 text-right text-foreground">{fmt(r.ventaBruta)}</td>
                      <td className="px-4 py-3 text-right text-foreground font-medium">{fmt(ventaNeta)}</td>
                      <td className="px-4 py-3 text-right text-primary font-bold">{fmt(aporte)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashOverview;
