import { useState } from 'react';
import { ChevronDown, ChevronRight, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import type { AccountingState } from '@/types/accounting';

interface IncomeStatementProps {
    state: AccountingState;
}

const fmt = (n: number) => new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
}).format(n);

const IncomeStatement = ({ state }: IncomeStatementProps) => {
    const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

    const toggleRow = (date: string) => {
        setExpandedRows(prev => ({
            ...prev,
            [date]: !prev[date]
        }));
    };

    // Agrupar y calcular datos por fecha
    const getDataByDate = () => {
        const dates = new Set<string>();
        state.registros.forEach(r => dates.add(r.fecha));
        state.compras.forEach(c => dates.add(c.fechaCompra));

        const sortedDates = Array.from(dates).sort((a, b) => b.localeCompare(a));

        return sortedDates.map(date => {
            const registro = state.registros.find(r => r.fecha === date);
            const ventas = registro?.ventaBruta || 0;

            // Costos Operativos (Salen de Caja Total)
            // Incluye: Gastos del registro diario + Compras de insumos (res, pollo, etc)
            const gastosDiarios = registro?.gastos || [];
            const totalGastosDiarios = gastosDiarios.reduce((sum, g) => sum + g.monto, 0);

            const comprasInsumos = state.compras.filter(c =>
                c.fechaCompra === date && (c.fuentePago === 'caja_total' || !c.fuentePago) // Fallback para antiguos
            );
            const totalComprasInsumos = comprasInsumos.reduce((sum, c) => sum + c.valor, 0);

            const totalCostos = totalGastosDiarios + totalComprasInsumos;

            // Gastos Administrativos (Salen del Ahorro)
            const gastosAdmin = state.compras.filter(c =>
                c.fechaCompra === date && c.fuentePago === 'ahorro'
            );
            const totalGastosAdmin = gastosAdmin.reduce((sum, c) => sum + c.valor, 0);

            const utilidadBruta = ventas - totalCostos;
            // La utilidad neta resta también los gastos administrativos
            const utilidadNeta = utilidadBruta - totalGastosAdmin;

            return {
                date,
                ventas,
                costos: {
                    total: totalCostos,
                    diarios: gastosDiarios,
                    insumos: comprasInsumos
                },
                gastosAdmin: {
                    total: totalGastosAdmin,
                    items: gastosAdmin
                },
                utilidadBruta,
                utilidadNeta
            };
        });
    };

    const data = getDataByDate();

    return (
        <div className="space-y-6">
            <div className="bg-card rounded-2xl shadow-card border border-border overflow-hidden">
                <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Estado de Resultados
                        </h2>
                        <p className="text-sm text-muted-foreground">Vista detallada de ingresos y egresos por día</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-medium w-10"></th>
                                <th className="px-6 py-4 font-medium">Fecha</th>
                                <th className="px-6 py-4 font-medium text-right text-success">Ventas (+)</th>
                                <th className="px-6 py-4 font-medium text-right text-warning">Costos (-)</th>
                                <th className="px-6 py-4 font-medium text-right">Utilidad Bruta</th>
                                <th className="px-6 py-4 font-medium text-right text-destructive">Gastos Admin (-)</th>
                                <th className="px-6 py-4 font-medium text-right text-primary">Utilidad Neta</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        No hay datos registrados
                                    </td>
                                </tr>
                            ) : (
                                data.map((row) => (
                                    <>
                                        <tr
                                            key={row.date}
                                            onClick={() => toggleRow(row.date)}
                                            className="hover:bg-muted/30 cursor-pointer transition-colors group"
                                        >
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {expandedRows[row.date] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-foreground whitespace-nowrap">
                                                {new Date(row.date).toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' })}
                                                <span className="text-xs text-muted-foreground block font-normal">{row.date}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-success">
                                                {fmt(row.ventas)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-warning">
                                                {fmt(row.costos.total)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium">
                                                {fmt(row.utilidadBruta)}
                                            </td>
                                            <td className="px-6 py-4 text-right font-medium text-destructive">
                                                {fmt(row.gastosAdmin.total)}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-bold ${row.utilidadNeta >= 0 ? 'text-primary' : 'text-destructive'}`}>
                                                {fmt(row.utilidadNeta)}
                                            </td>
                                        </tr>

                                        {/* Detalles Desplegables */}
                                        {expandedRows[row.date] && (
                                            <tr className="bg-muted/20">
                                                <td colSpan={7} className="px-6 py-4">
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pl-10">
                                                        {/* Sección Costos */}
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold text-warning flex items-center gap-2 text-xs uppercase tracking-wider">
                                                                <DollarSign className="w-3 h-3" /> Detalle de Costos (Caja Total)
                                                            </h4>
                                                            <div className="space-y-2 text-sm pl-4 border-l-2 border-warning/20">
                                                                {row.costos.insumos.length === 0 && row.costos.diarios.length === 0 && (
                                                                    <p className="text-muted-foreground italic text-xs">Sin costos registrados</p>
                                                                )}

                                                                {row.costos.insumos.map(c => (
                                                                    <div key={c.id} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                                                                        <span className="text-muted-foreground">{c.tipo} - {c.proveedor}</span>
                                                                        <span className="font-medium text-warning">{fmt(c.valor)}</span>
                                                                    </div>
                                                                ))}

                                                                {row.costos.diarios.map(g => (
                                                                    <div key={g.id} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                                                                        <span className="text-muted-foreground">Gasto Diario - {g.nombre}</span>
                                                                        <span className="font-medium text-warning">{fmt(g.monto)}</span>
                                                                    </div>
                                                                ))}

                                                                <div className="flex justify-between items-center pt-2 font-semibold">
                                                                    <span>Total Costos</span>
                                                                    <span>{fmt(row.costos.total)}</span>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sección Gastos Administrativos */}
                                                        <div className="space-y-3">
                                                            <h4 className="font-semibold text-destructive flex items-center gap-2 text-xs uppercase tracking-wider">
                                                                <DollarSign className="w-3 h-3" /> Gastos Administrativos (Ahorro)
                                                            </h4>
                                                            <div className="space-y-2 text-sm pl-4 border-l-2 border-destructive/20">
                                                                {row.gastosAdmin.items.length === 0 && (
                                                                    <p className="text-muted-foreground italic text-xs">Sin gastos administrativos</p>
                                                                )}

                                                                {row.gastosAdmin.items.map(c => (
                                                                    <div key={c.id} className="flex justify-between items-center py-1 border-b border-border/50 last:border-0">
                                                                        <span className="text-muted-foreground">{c.tipo} - {c.proveedor}</span>
                                                                        <span className="font-medium text-destructive">{fmt(c.valor)}</span>
                                                                    </div>
                                                                ))}

                                                                <div className="flex justify-between items-center pt-2 font-semibold">
                                                                    <span>Total Gastos Admin</span>
                                                                    <span>{fmt(row.gastosAdmin.total)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default IncomeStatement;
