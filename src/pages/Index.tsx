import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Locations from '@/components/Locations';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Beef, Drumstick, Sparkles, ArrowRight } from 'lucide-react';

const features = [
  { icon: Beef, title: 'Carnes Selectas', desc: 'Solo los mejores cortes de res, cerdo y pollo llegan a nuestro mostrador.' },
  { icon: Drumstick, title: 'Frescura Diaria', desc: 'Recibimos producto fresco todos los días para garantizar la mejor calidad.' },
  { icon: Sparkles, title: 'Asesoría Experta', desc: 'Te ayudamos a elegir el corte perfecto para cada preparación.' },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />

      {/* Features */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <feat.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-foreground mb-2">{feat.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Aprende */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              ¿Sabes qué corte necesitas?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-lg mx-auto">
              Explora nuestros diagramas interactivos de res, cerdo y pollo para aprender sobre cada corte y sus mejores preparaciones.
            </p>
            <Link
              to="/aprende"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-foreground text-foreground font-semibold hover:bg-primary-foreground/90 transition-all shadow-lg"
            >
              Aprende de Carnes <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Locations />

      {/* Fun counter */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { num: '13+', label: 'Años de experiencia' },
              { num: '40+', label: 'Cortes disponibles' },
              { num: '1', label: 'Sedes' },
              { num: '100%', label: 'Frescura garantizada' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-gradient-primary mb-1">{stat.num}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
