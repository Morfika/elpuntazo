import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import InteractiveCow from '@/components/InteractiveCow';
import InteractivePig from '@/components/InteractivePig';
import InteractiveChicken from '@/components/InteractiveChicken';
import { motion } from 'framer-motion';

type AnimalTab = 'res' | 'cerdo' | 'pollo';

const CowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5c-4 0-7 3-7 6v7h14v-7c0-3-3-6-7-6z" />
    <path d="M5 11c-2 0-2-3 0-3" />
    <path d="M19 11c2 0 2-3 0-3" />
    <path d="M12 18c-2 0-3 1-3 2h6c0-1-1-2-3-2z" />
    <path d="M8 5L6 2" />
    <path d="M16 5l2-3" />
  </svg>
);

const PigIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-5 0-9 4-9 9s4 9 9 9 9-4 9-9-4-9-9-9z" />
    <path d="M7 7L5 5" />
    <path d="M17 7l2-2" />
    <ellipse cx="12" cy="14" rx="4" ry="3" />
    <path d="M10 14h.01" />
    <path d="M14 14h.01" />
  </svg>
);

const ChickenIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.5 5.5C10.5 2.5 12.5 1 12.5 1c0 0 2 1.5 2 4.5" />
    <path d="M12.5 15.5a5 5 0 1 0-5-5" />
    <path d="M17.5 10.5h2l-2 3" />
    <path d="M7.5 15.5c-1 2 1 4 3 6" />
    <circle cx="13.5" cy="10.5" r="1" fill="currentColor" />
  </svg>
);

const tabs: { id: AnimalTab; label: string; icon: React.ReactNode }[] = [
  { id: 'res', label: 'Res', icon: <CowIcon /> },
  { id: 'cerdo', label: 'Cerdo', icon: <PigIcon /> },
  { id: 'pollo', label: 'Pollo', icon: <ChickenIcon /> },
];

const LearnMeats = () => {
  const [active, setActive] = useState<AnimalTab>('res');

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Aprende de Carnes</h1>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            Haz clic en cada corte para conocer sus usos y preparaciones ideales
          </p>
        </motion.div>

        {/* Animal tabs */}
        <div className="flex justify-center gap-2 sm:gap-4 mb-10 px-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-3 px-3 sm:px-6 py-2 sm:py-3 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 border ${active === tab.id
                ? 'bg-primary text-white border-primary shadow-lg scale-105'
                : 'bg-white text-gray-600 border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                }`}
            >
              <span className="text-current opacity-90">{tab.icon}</span>
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {active === 'res' && <InteractiveCow />}
          {active === 'cerdo' && <InteractivePig />}
          {active === 'pollo' && <InteractiveChicken />}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
};

export default LearnMeats;
