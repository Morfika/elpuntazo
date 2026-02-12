import { useState, useEffect } from 'react';
import { MapPin, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import type { Sede } from '@/types/accounting';
import { defaultSedes } from '@/hooks/useAccounting';

const Locations = () => {
  const [sedes, setSedes] = useState<Sede[]>(defaultSedes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSedes = async () => {
      try {
        const { data, error } = await supabase
          .from('sedes')
          .select('*')
          .eq('activa', true)
          .order('nombre');

        if (error) {
          console.error('Error loading sedes:', error);
          return;
        }

        if (data && data.length > 0) {
          setSedes(data.map(s => ({
            id: s.id,
            nombre: s.nombre,
            direccion: s.direccion,
            telefono: s.telefono,
            horario: s.horario,
            activa: s.activa,
          })));
        }
      } catch (error) {
        console.error('Error loading sedes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSedes();
  }, []);

  if (loading) {
    return (
      <section id="sedes" className="py-20 bg-secondary">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando sedes...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="sedes" className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Nuestras Sedes</h2>
          <p className="text-muted-foreground text-lg max-w-md mx-auto">Visítanos en cualquiera de nuestros puntos de atención</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {sedes.map((sede, idx) => (
            <motion.div
              key={sede.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-warm transition-shadow duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-bold text-lg text-foreground mb-3">{sede.nombre}</h3>
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary/60 shrink-0" />
                  <span>{sede.direccion}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-primary/60 shrink-0" />
                  <span>{sede.telefono}</span>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary/60 shrink-0" />
                  <span>{sede.horario}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Locations;
