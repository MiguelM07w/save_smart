import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import logo from "../../assets/images/logo_savesmart.png";

const LEN = 25;
const ANIM_TIME = 45; // segundos

const combos: [string, string, string][] = [
  ['rgb(232 121 249)', 'rgb(96 165 250)', 'rgb(94 234 212)'],
  ['rgb(232 121 249)', 'rgb(94 234 212)', 'rgb(96 165 250)'],
  ['rgb(94 234 212)', 'rgb(232 121 249)', 'rgb(96 165 250)'],
  ['rgb(94 234 212)', 'rgb(96 165 250)', 'rgb(232 121 249)'],
  ['rgb(96 165 250)', 'rgb(94 234 212)', 'rgb(232 121 249)'],
  ['rgb(96 165 250)', 'rgb(232 121 249)', 'rgb(94 234 212)'],
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  const logos = [
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/1.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/2.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/3.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/4.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/5.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/6.png',
  'https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/7.png',
];

  return (
    <div className="landing-page">
      {/* Fondo animado */}
      <div className="bg-rainbow" aria-hidden="true">
        {Array.from({ length: LEN }).map((_, idx) => {
          const i = idx + 1;
          const dur = ANIM_TIME - (ANIM_TIME / LEN / 2) * i; // ~45s → 22.5s
          const delay = -(i / LEN) * ANIM_TIME; // offsets negativos
          const [c1, c2, c3] = combos[idx % combos.length];

          return (
            <span
              key={i}
              className="rainbow"
              style={{
                ['--c1' as any]: c1,
                ['--c2' as any]: c2,
                ['--c3' as any]: c3,
                ['--dur' as any]: `${dur}s`,
                ['--delay' as any]: `${delay}s`,
              } as React.CSSProperties}
            />
          );
        })}
        <span className="h" />
        <span className="v" />
      </div>

      {/* Header with centered menu and logo */}
      <header className="landing-header">
        <nav className="landing-nav container" aria-label="Navegación principal">
          <div className="nav-logo">
            <img src={logo} alt="Logotipo de SaveSmart" className="logo-image" />
          </div>

          <ul className="nav-menu">
            <li><a href="#inicio" onClick={(e) => handleNavClick(e, 'inicio')}>Inicio</a></li>
            <li><a href="#servicios" onClick={(e) => handleNavClick(e, 'servicios')}>Servicios</a></li>
            <li><a href="#nosotros" onClick={(e) => handleNavClick(e, 'nosotros')}>Nosotros</a></li>
            <li><a href="#contacto" onClick={(e) => handleNavClick(e, 'contacto')}>Contacto</a></li>
          </ul>

          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Controla tus Finanzas con SaveSmart
            </h1>
            <p className="hero-subtitle">
              Gestión inteligente de ingresos y gastos personales
            </p>
            <p className="hero-description">
              Lleva el control total de tu dinero, visualiza tus gastos, analiza tendencias y toma mejores decisiones financieras
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                Comenzar Ahora
              </button>
              <button className="btn btn-outline btn-lg" onClick={() => scrollToSection('servicios')}>
                Conocer Más
              </button>
            </div>
          </div>
        </div>
      </section>

            {/* Carrusel de logos */}
      <div className="hero-logos">
        <div className="slider" aria-label="Logos de empresas que confían en SaveSmart">
          <div className="slide-track">
            {[...logos, ...logos].map((src, i) => (
              <div className="slide" key={i}>
                <img
                  src={src}
                  height={100}
                  width={250}
                  alt={`Logo ${i % logos.length + 1}`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Services Section */}
      <section id="servicios" className="services-section">
        <div className="container">
          <h2 className="section-title">Características Principales</h2>
          <p className="section-subtitle">
            Herramientas poderosas para el control total de tus finanzas personales
          </p>

          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">💰</div>
              <h3>Registro de Ingresos</h3>
              <p>
                Registra todos tus ingresos por categoría: salarios, freelance, inversiones,
                ventas y más. Todo organizado en un solo lugar.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">💸</div>
              <h3>Control de Gastos</h3>
              <p>
                Lleva un seguimiento detallado de todos tus gastos por categoría: alimentación,
                transporte, servicios, entretenimiento y más.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📊</div>
              <h3>Estadísticas Avanzadas</h3>
              <p>
                Visualiza tus finanzas con gráficas interactivas, filtros por período
                (diario, semanal, mensual, anual) y análisis detallados.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📈</div>
              <h3>Tendencias y Análisis</h3>
              <p>
                Identifica patrones de gasto, descubre oportunidades de ahorro
                y toma decisiones financieras más inteligentes.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">📄</div>
              <h3>Exportación de Reportes</h3>
              <p>
                Descarga tus estadísticas en formato PDF o CSV para análisis externo,
                declaraciones fiscales o simplemente para tus registros.
              </p>
            </div>

            <div className="service-card">
              <div className="service-icon">🎯</div>
              <h3>Interfaz Intuitiva</h3>
              <p>
                Diseño moderno y fácil de usar. Agrega transacciones en segundos
                y accede a toda tu información de forma rápida y clara.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="nosotros" className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2 className="section-title">¿Por qué SaveSmart?</h2>
              <p>
                <strong>SaveSmart</strong> es tu compañero ideal para alcanzar la libertad financiera.
                Diseñado para personas que quieren tomar el control de su dinero de forma simple y efectiva.
              </p>
              <p>
                Con SaveSmart puedes visualizar claramente a dónde va tu dinero, identificar oportunidades
                de ahorro y tomar decisiones financieras más inteligentes basadas en datos reales.
              </p>

              <div className="features-list">
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Registro rápido de ingresos y gastos</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Visualización clara con gráficas interactivas</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Filtros por período (día, semana, mes, año)</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Categorización automática de transacciones</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Exportación de reportes en PDF y CSV</span>
                </div>
                <div className="feature-item">
                  <span className="feature-check">✓</span>
                  <span>Interfaz moderna y fácil de usar</span>
                </div>
              </div>
            </div>

            <div className="about-stats">
              <div className="stat-card">
                <h3>100%</h3>
                <p>Gratis</p>
              </div>
              <div className="stat-card">
                <h3>24/7</h3>
                <p>Disponible</p>
              </div>
              <div className="stat-card">
                <h3>∞</h3>
                <p>Transacciones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="contact-section">
        <div className="container">
          <h2 className="section-title">Contáctanos</h2>
          <p className="section-subtitle">
            ¿Tienes preguntas? Estamos aquí para ayudarte
          </p>

          <div className="contact-grid">
            <div className="contact-info">
              <div className="contact-item">
                <div className="contact-icon">📧</div>
                <div>
                  <h4>Email</h4>
                  <p>contacto@savesmarth.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📱</div>
                <div>
                  <h4>Teléfono</h4>
                  <p>+52 (55) 1234-5678</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div>
                  <h4>Dirección</h4>
                  <p>Ciudad de México, México</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">⏰</div>
                <div>
                  <h4>Horario</h4>
                  <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                <div className="input-group">
                  <input type="text" className="input" placeholder="Nombre completo" required />
                </div>
                <div className="input-group">
                  <input type="email" className="input" placeholder="Email" required />
                </div>
                <div className="input-group">
                  <input type="tel" className="input" placeholder="Teléfono" />
                </div>
                <div className="input-group">
                  <textarea
                    className="textarea"
                    rows={5}
                    placeholder="Mensaje"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>SaveSmart</h3>
              <p>
                Tu aliado para el control inteligente de finanzas personales.
                Simple, efectivo y gratuito.
              </p>
            </div>

            <div className="footer-section">
              <h4>Enlaces Rápidos</h4>
              <ul>
                <li><a href="#inicio" onClick={(e) => handleNavClick(e, 'inicio')}>Inicio</a></li>
                <li><a href="#servicios" onClick={(e) => handleNavClick(e, 'servicios')}>Características</a></li>
                <li><a href="#nosotros" onClick={(e) => handleNavClick(e, 'nosotros')}>Nosotros</a></li>
                <li><a href="#contacto" onClick={(e) => handleNavClick(e, 'contacto')}>Contacto</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Legal</h4>
              <ul>
                <li><a href="#">Términos y Condiciones</a></li>
                <li><a href="#">Política de Privacidad</a></li>
                <li><a href="#">Aviso de Privacidad</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Síguenos</h4>
              <div className="social-links">
                <a href="#" className="social-link">Facebook</a>
                <a href="#" className="social-link">Twitter</a>
                <a href="#" className="social-link">Instagram</a>
                <a href="#" className="social-link">LinkedIn</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>&copy; 2025 SaveSmart. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;