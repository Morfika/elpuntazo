import { useState } from 'react';
import { Plus, Trash2, Edit3, Save, X, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import ConfirmDialog from '@/components/ui/confirm-dialog';
import type { Sede } from '@/types/accounting';

interface Props {
  state: { sedes: Sede[] };
  addSede: (sede: Omit<Sede, 'id'>) => void;
  updateSede: (id: string, updates: Partial<Sede>) => void;
  removeSede: (id: string) => void;
}

const LocationsManager = ({ state, addSede, updateSede, removeSede }: Props) => {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ nombre: '', direccion: '', telefono: '', horario: '' });

  const handleAdd = () => {
    if (!form.nombre.trim() || !form.direccion.trim()) return;
    addSede({ ...form, activa: true });
    setForm({ nombre: '', direccion: '', telefono: '', horario: '' });
    setShowForm(false);
    toast.success('Sede añadida');
  };

  const startEdit = (sede: Sede) => {
    setEditId(sede.id);
    setForm({ nombre: sede.nombre, direccion: sede.direccion, telefono: sede.telefono, horario: sede.horario });
  };

  const handleSaveEdit = (id: string) => {
    updateSede(id, form);
    setEditId(null);
    toast.success('Sede actualizada');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-lg">Puntos de Atención</h3>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Nueva Sede
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl p-5 shadow-card border border-border">
          <h4 className="font-medium text-foreground mb-3">Nueva Sede</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
            <input placeholder="Horario" value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })}
              className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
          </div>
          <button onClick={handleAdd}
            className="mt-3 px-6 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            Guardar
          </button>
        </div>
      )}

      <div className="space-y-3">
        {state.sedes.map(sede => (
          <div key={sede.id} className="bg-card rounded-2xl p-5 shadow-card border border-border">
            {editId === sede.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
                  <input value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
                  <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
                  <input value={form.horario} onChange={e => setForm({ ...form, horario: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleSaveEdit(sede.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success text-success-foreground text-sm font-medium">
                    <Save className="w-3.5 h-3.5" /> Guardar
                  </button>
                  <button onClick={() => setEditId(null)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm font-medium">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{sede.nombre}</h4>
                    <p className="text-sm text-muted-foreground">{sede.direccion}</p>
                    <p className="text-sm text-muted-foreground">{sede.telefono} • {sede.horario}</p>
                    <span className={`inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded ${sede.activa ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {sede.activa ? 'Activa' : 'Inactiva'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => updateSede(sede.id, { activa: !sede.activa })}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground text-xs">
                    {sede.activa ? 'Desactivar' : 'Activar'}
                  </button>
                  <button onClick={() => startEdit(sede)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Edit3 className="w-4 h-4 text-muted-foreground" />
                  </button>
                  <ConfirmDialog
                    trigger={
                      <button className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </button>
                    }
                    title="¿Eliminar esta sede?"
                    description={`Se eliminará "${sede.nombre}". Esta acción no se puede deshacer.`}
                    onConfirm={() => { removeSede(sede.id); toast.success('Sede eliminada'); }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsManager;
