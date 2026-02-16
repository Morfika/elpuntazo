import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import heroImage from '@/assets/hero-meat.jpg';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroImage} alt="Exhibición de carnes frescas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-hero bg-inherit" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="max-w-3xl mx-auto">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">

            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-warm" />
            <span className="text-primary-foreground/90 text-sm font-medium">Calidad y frescura garantizada</span>
          </motion.div>

          {/* Logo/Title */}
          <div className="mb-6">
            <img src="/logoelpuntazo.svg" alt="El Puntazo Logo" className="w-32 h-32 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-primary-foreground mb-4 tracking-tight">
            El Puntazo
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/80 font-light mb-10 max-w-xl mx-auto">
            Tu expendio de carnes de confianza. Frescura, calidad y los mejores cortes para tu mesa.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/aprende"
              className="px-8 py-3.5 rounded-full bg-primary-foreground text-foreground font-semibold text-base hover:bg-primary-foreground/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">

              Aprende de Carnes
            </Link>
            <a
              href="#sedes"
              className="px-8 py-3.5 rounded-full border-2 border-primary-foreground/40 text-primary-foreground font-semibold text-base hover:bg-primary-foreground/10 transition-all">

              Nuestras Sedes
            </a>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}>

        <ChevronDown className="w-6 h-6 text-primary-foreground/60" />
      </motion.div>
    </section>);

};

export default Hero;