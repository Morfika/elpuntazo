import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground py-12">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-extrabold text-sm">P</span>
            </div>
            <span className="font-bold text-lg">El Puntazo</span>
          </div>
          <p className="text-primary-foreground/60 text-sm leading-relaxed">
            Tu expendio de carnes de confianza. Calidad, frescura y los mejores precios para tu hogar.
          </p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/80">Navegación</h4>
          <div className="flex flex-col gap-2">
            <Link to="/" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Inicio</Link>
            <Link to="/aprende" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Aprende de Carnes</Link>
            <Link to="/admin/dashboard" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Administración</Link>
          </div>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-primary-foreground/80">Contacto</h4>
          <div className="flex flex-col gap-2 text-sm text-primary-foreground/60">
            <span>📞 300 123 4567</span>
            <span>📍 Centro y Norte</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} El Puntazo — Expendio de Carnes. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default Footer;
