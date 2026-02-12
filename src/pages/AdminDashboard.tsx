import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAccounting } from '@/hooks/useAccounting';
import Header from '@/components/Header';
import CashOverview from '@/components/accounting/CashOverview';
import DailyRegister from '@/components/accounting/DailyRegister';
import PurchaseTracker from '@/components/accounting/PurchaseTracker';
import ExpenseReport from '@/components/accounting/ExpenseReport';
import LocationsManager from '@/components/admin/LocationsManager';
import { DollarSign, ClipboardList, ShoppingCart, BarChart3, MapPin, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

type TabId = 'resumen' | 'registro' | 'compras' | 'gastos' | 'sedes';

const tabs: { id: TabId; label: string; icon: typeof DollarSign }[] = [
  { id: 'resumen', label: 'Resumen', icon: DollarSign },
  { id: 'registro', label: 'Registro Diario', icon: ClipboardList },
  { id: 'compras', label: 'Costos', icon: ShoppingCart },
  { id: 'gastos', label: 'Gastos', icon: BarChart3 },
  { id: 'sedes', label: 'Sedes', icon: MapPin },
];

const AdminDashboard = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const accounting = useAccounting();
  const [activeTab, setActiveTab] = useState<TabId>('resumen');

  useEffect(() => {
    if (!isAuthenticated) navigate('/admin');
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Horizontal tab bar */}
      <div className="sticky top-16 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors ml-auto whitespace-nowrap"
            >
              <LogOut className="w-4 h-4" /> Salir
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-6 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'resumen' && <CashOverview state={accounting.state} />}
          {activeTab === 'registro' && (
            <DailyRegister
              state={accounting.state}
              addGasto={accounting.addGasto}
              removeGasto={accounting.removeGasto}
              closeDay={accounting.closeDay}
              reopenDay={accounting.reopenDay}
              updateDayVentaBruta={accounting.updateDayVentaBruta}
              getDaySummary={accounting.getDaySummary}
            />
          )}
          {activeTab === 'compras' && (
            <PurchaseTracker
              state={accounting.state}
              addCompra={accounting.addCompra}
              markCompraPaid={accounting.markCompraPaid}
              removeCompra={accounting.removeCompra}
              getPurchasesByType={accounting.getPurchasesByType}
              getPurchaseTotals={accounting.getPurchaseTotals}
            />
          )}
          {activeTab === 'gastos' && (
            <ExpenseReport
              state={accounting.state}
              getGroupedExpenses={accounting.getGroupedExpenses}
            />
          )}
          {activeTab === 'sedes' && (
            <LocationsManager
              state={accounting.state}
              addSede={accounting.addSede}
              updateSede={accounting.updateSede}
              removeSede={accounting.removeSede}
            />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminDashboard;
