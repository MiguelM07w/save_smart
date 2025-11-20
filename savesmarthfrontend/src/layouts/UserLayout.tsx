import React, { useEffect, useRef, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { markAsRead, markAllAsRead } from '../store/slices/notificationSlice';
import logo from '../assets/images/logo_savesmart.png';
import './styles/UserLayout.css';
import './styles/UserBackground.css';
import './styles/UserHeader.css';
import './styles/UserDropdown.css';
import './styles/UserResponsive.css';
import './styles/NotificationGlowButton.css'; // <-- nuevo

type IconProps = { size?: number; className?: string };

const IconHome: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true" focusable="false">
    <path d="M3.75 11.25L12 4l8.25 7.25V20a2 2 0 0 1-2 2H5.75a2 2 0 0 1-2-2v-8.75z" />
    <path d="M10 22v-6h4v6" />
  </svg>
);

const IconFileText: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
    <path d="M10 9H8" />
  </svg>
);

const IconBarChart: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <line x1="6" y1="20" x2="6" y2="14" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="18" y1="20" x2="18" y2="10" />
  </svg>
);

const IconGrid: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconUser: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconSliders: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <line x1="4" y1="21" x2="4" y2="14" />
    <line x1="4" y1="10" x2="4" y2="3" />
    <line x1="12" y1="21" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12" y2="3" />
    <line x1="20" y1="21" x2="20" y2="16" />
    <line x1="20" y1="12" x2="20" y2="3" />
    <line x1="1" y1="14" x2="7" y2="14" />
    <line x1="9" y1="8" x2="15" y2="8" />
    <line x1="17" y1="16" x2="23" y2="16" />
  </svg>
);

const IconLogout: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const IconChevronDown: React.FC<IconProps> = ({ size = 14, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconBook: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const IconNewspaper: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8" />
    <path d="M15 18h-5" />
    <path d="M10 6h8v4h-8z" />
  </svg>
);

const IconMenu: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const IconClose: React.FC<IconProps> = ({ size = 24, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M6 6l12 12M6 18L18 6" />
  </svg>
);

const IconBell: React.FC<IconProps> = ({ size = 20, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const UserLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, notifications } = useAppSelector(state => state.notifications);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const navRef = useRef<HTMLElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  const openNav = () => {
    setIsNavOpen(true);
    document.body.classList.add('menu-open');
    requestAnimationFrame(() => {
      const firstFocusable = navRef.current?.querySelector<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus?.();
    });
  };

  const closeNav = (focusToggle = false) => {
    setIsNavOpen(false);
    document.body.classList.remove('menu-open');
    if (focusToggle) toggleRef.current?.focus?.();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isNavOpen) closeNav(true);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isNavOpen]);

  useEffect(() => {
    if (isNavOpen) closeNav(false);
  }, [location.pathname]); // eslint-disable-line

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => {
      if (!e.matches) closeNav(false);
    };
    if (mq.addEventListener) mq.addEventListener('change', handler);
    else mq.addListener(handler);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handler);
      else mq.removeListener(handler);
    };
  }, []); // eslint-disable-line

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="user-layout">
      {/* Fondo deslizante en diagonales */}
      <div className="ul-bg" />
      <div className="ul-bg ul-bg2" />
      <div className="ul-bg ul-bg3" />

      {/* Contenido por encima del fondo */}
      <div className="user-layout-content">
        {/* Header con patrón grid + glass */}
        <header className="user-header menu-surface">
          <div className="user-header-container">
            <div className="header-left">
              <NavLink to="/user/home" className="logo-link">
                <img src={logo} alt="SaveSmart" className="header-logo" />
              </NavLink>
            </div>

            {/* Botón hamburguesa (móvil/tablet) */}
            <button
              className="nav-toggle"
              aria-controls="primary-navigation"
              aria-expanded={isNavOpen}
              onClick={() => {
                setShowProfileMenu(false);
                isNavOpen ? closeNav(true) : openNav();
              }}
              ref={toggleRef}
            >
              <span className="sr-only">{isNavOpen ? 'Cerrar menú' : 'Abrir menú'}</span>
              <span className="icon icon-menu"><IconMenu /></span>
              <span className="icon icon-close"><IconClose /></span>
            </button>

            {/* Navegación principal con patrón grid */}
            <nav
              id="primary-navigation"
              aria-label="Navegación principal"
              className={`header-nav ${isNavOpen ? 'is-open' : ''} menu-surface`}
              data-collapsible
              ref={navRef as any}
              onClick={(e) => {
                const anchor = (e.target as HTMLElement).closest('a');
                if (anchor) closeNav(false);
              }}
            >
              <NavLink to="/user/home" className="nav-link">
                <span className="nav-icon"><IconHome /></span>
                <span>Inicio</span>
              </NavLink>
              <NavLink to="/user/forms" className="nav-link">
                <span className="nav-icon"><IconFileText /></span>
                <span>Gastos/Ingresos</span>
              </NavLink>
              <NavLink to="/user/charts" className="nav-link">
                <span className="nav-icon"><IconBarChart /></span>
                <span>Gráficas</span>
              </NavLink>
              <NavLink to="/user/dashboard" className="nav-link">
                <span className="nav-icon"><IconGrid /></span>
                <span>Dashboard</span>
              </NavLink>
              <NavLink to="/user/learn" className="nav-link">
                <span className="nav-icon"><IconBook /></span>
                <span>Aprende</span>
              </NavLink>
              <NavLink to="/user/news" className="nav-link">
                <span className="nav-icon"><IconNewspaper /></span>
                <span>Noticias</span>
              </NavLink>
              <NavLink to="/user/payments" className="nav-link">
                <span className="nav-icon">💳</span>
                <span>Pagos</span>
              </NavLink>
            </nav>

            <div className="header-right">
              {/* Botón de Notificaciones (Glow) */}
              <div className="notifications-wrapper" style={{ position: 'relative', marginRight: '1rem' }}>
                <button
                  type="button"
                  className="glow-notify"
                  onClick={() => setShowNotifications(!showNotifications)}
                  aria-expanded={showNotifications}
                  aria-controls="notifications-popover"
                  title="Notificaciones"
                  style={{ ['--gn-size' as any]: '39px' }} // ajusta tamaño si quieres
                >
                  <i className="gn-icon" aria-hidden="true">
                    {/* Campana animada */}
                    <svg viewBox="0 0 56 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.3999 44.0002V39.2102C9.3999 39.2102 14.2299 38.9702 14.2299 34.3802V19.1002C14.2299 19.1002 14.1799 6.43018 27.8599 6.43018C39.9199 6.43018 42.8599 13.4302 42.8599 18.6402V35.2302C42.8599 35.2302 42.4999 39.2302 47.6599 39.2302V44.0002H9.3999Z" stroke="black" strokeWidth="3" strokeDasharray="0,0,109.7099609375,27.427490234374993">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,109.7099609375,27.427490234374993; 0,27.427490234374993,109.7099609375,0; 109.7099609375,27.427490234374993,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M32.24 6.78998V5.46998C32.24 4.47807 31.846 3.52679 31.1446 2.8254C30.4432 2.12402 29.4919 1.72998 28.5 1.72998C27.5081 1.72998 26.5568 2.12402 25.8554 2.8254C25.154 3.52679 24.76 4.47807 24.76 5.46998V6.66998" stroke="black" strokeWidth="3" strokeDasharray="0,0,11.415697479248047,2.853924369812011">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,11.415697479248047,2.853924369812011; 0,2.853924369812011,11.415697479248047,0; 11.415697479248047,2.853924369812011,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M32.33 44C32.275 45.1738 31.77 46.2812 30.92 47.0925C30.0699 47.9037 28.94 48.3563 27.7649 48.3563C26.5899 48.3563 25.46 47.9037 24.6099 47.0925C23.7599 46.2812 23.2549 45.1738 23.2 44" stroke="black" strokeWidth="3" strokeDasharray="0,0,11.143664550781251,2.785916137695312">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,11.143664550781251,2.785916137695312; 0,2.785916137695312,11.143664550781251,0; 11.143664550781251,2.785916137695312,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M46.5 26.4902C47.2034 26.7872 47.8233 27.2522 48.3053 27.8444C48.7874 28.4366 49.1168 29.138 49.2649 29.887C49.4129 30.6361 49.375 31.4101 49.1545 32.1411C48.934 32.8721 48.5376 33.538 48 34.0802" stroke="black" strokeWidth="3" strokeDasharray="0,0,7.293882751464844,1.8234706878662106">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,7.293882751464844,1.8234706878662106; 0,1.8234706878662106,7.293882751464844,0; 7.293882751464844,1.8234706878662106,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M49.3 23C50.5062 23.5068 51.5697 24.3017 52.3973 25.315C53.2249 26.3283 53.7913 27.5292 54.0469 28.8123C54.3026 30.0954 54.2396 31.4216 53.8636 32.6747C53.4875 33.9279 52.8099 35.0696 51.89 36" stroke="black" strokeWidth="3" strokeDasharray="0,0,12.497595977783204,3.1243989944458">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,12.497595977783204,3.1243989944458; 0,3.1243989944458,12.497595977783204,0; 12.497595977783204,3.1243989944458,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M9.99992 26.7402C9.29398 27.0343 8.67126 27.4976 8.1867 28.0892C7.70214 28.6808 7.37062 29.3826 7.22141 30.1327C7.07219 30.8827 7.10985 31.6579 7.33108 32.39C7.5523 33.122 7.95028 33.7884 8.48992 34.3302" stroke="black" strokeWidth="3" strokeDasharray="0,0,7.304747772216797,1.8261869430541988">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,7.304747772216797,1.8261869430541988; 0,1.8261869430541988,7.304747772216797,0; 7.304747772216797,1.8261869430541988,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                      <path d="M7.17011 23.2598C5.96393 23.7666 4.90046 24.5615 4.07288 25.5748C3.2453 26.5881 2.67887 27.7889 2.42324 29.072C2.1676 30.3552 2.23056 31.6814 2.6066 32.9345C2.98263 34.1876 3.66026 35.3294 4.58011 36.2598" stroke="black" strokeWidth="3" strokeDasharray="0,0,12.497511291503907,3.1243778228759758">
                        <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="1.47s" values="0,0,12.497511291503907,3.1243778228759758; 0,3.1243778228759758,12.497511291503907,0; 12.497511291503907,3.1243778228759758,0,0" keyTimes="0; 0.2; 1"></animate>
                      </path>
                    </svg>
                  </i>

                  {unreadCount > 0 && (
                    <span className="gn-badge" aria-hidden="true">
                      <p>{unreadCount > 99 ? '99+' : unreadCount > 9 ? '9+' : unreadCount}</p>
                      <svg viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="37" cy="37" r="36" stroke="#7afffb" strokeWidth="2" strokeDasharray="0,0,0,0,0,225.8292694091797">
                          <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="5.4365s" values="0,0,0,0,0,225.8292694091797; 0,0,0,45.5979,89.0356,91.1958; 0,0,75.2764,0,150.5528,225.8293; 0,0,150.5528,0,75.2764,225.8293; 0,0,188.1911,37.6382,0,0; 0,225.8293,0,75.2764,0,225.8293" keyTimes="0; 0.1666; 0.3333; 0.6666; 0.8333; 1" begin="0.9359s"></animate>
                        </circle>
                      </svg>
                    </span>
                  )}

                  {/* Anillo exterior */}
                  <svg className="gn-ring" viewBox="0 0 74 74" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <circle cx="37" cy="37" r="36" stroke="black" strokeWidth="2" strokeDasharray="0,0,0,0,0,225.8292694091797">
                      <animate attributeType="XML" attributeName="stroke-dasharray" repeatCount="indefinite" dur="5.4365s" values="0,0,0,0,0,225.8292694091797; 0,0,0,45.5979,89.0356,91.1958; 0,0,75.2764,0,150.5528,225.8293; 0,0,150.5528,0,75.2764,225.8293; 0,0,188.1911,37.6382,0,0; 0,225.8293,0,75.2764,0,225.8293" keyTimes="0; 0.1666; 0.3333; 0.6666; 0.8333; 1" begin="0.9359s"></animate>
                    </circle>
                  </svg>
                </button>

                {showNotifications && (
                  <div
                    id="notifications-popover"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      width: '350px',
                      maxHeight: '400px',
                      overflow: 'hidden',
                      zIndex: 1000
                    }}
                  >
                    <div style={{ padding: '1rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>Notificaciones</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => dispatch(markAllAsRead())}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#3b82f6',
                            fontSize: '0.875rem',
                            cursor: 'pointer',
                            padding: '0.25rem 0.5rem'
                          }}
                        >
                          Marcar todas como leídas
                        </button>
                      )}
                    </div>
                    <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
                          <IconBell size={48} />
                          <p style={{ marginTop: '0.5rem' }}>No hay notificaciones</p>
                        </div>
                      ) : (
                        notifications.slice(0, 10).map(notif => (
                          <div
                            key={notif.id}
                            onClick={() => dispatch(markAsRead(notif.id))}
                            style={{
                              padding: '1rem',
                              borderBottom: '1px solid #f3f4f6',
                              cursor: 'pointer',
                              background: notif.isRead ? 'white' : '#eff6ff',
                              transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = '#f9fafb'}
                            onMouseLeave={(e) => e.currentTarget.style.background = notif.isRead ? 'white' : '#eff6ff'}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                              <strong style={{ fontSize: '0.875rem', color: '#111827' }}>{notif.title}</strong>
                              {!notif.isRead && (
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0, marginTop: '0.25rem' }} />
                              )}
                            </div>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6b7280' }}>{notif.message}</p>
                            <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem', display: 'block' }}>
                              {new Date(notif.createdAt).toLocaleString()}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="user-menu-wrapper">
                <button
                  className="user-menu-button"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  aria-expanded={showProfileMenu}
                  aria-haspopup="menu"
                >
                  <div className="user-avatar-small">
                    {user?.photo ? (
                      <img src={user.photo} alt="Avatar" className="avatar-image-small" />
                    ) : (
                      <span>{user?.username?.charAt(0).toUpperCase() || 'U'}</span>
                    )}
                  </div>
                  <span className="user-name-header">{user?.username}</span>
                  <span className="dropdown-arrow">
                    <IconChevronDown />
                  </span>
                </button>

                {showProfileMenu && (
                  <div className="user-dropdown" role="menu">
                    <div className="dropdown-header">
                      <p className="dropdown-username">{user?.username}</p>
                      <p className="dropdown-email">{user?.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      onClick={() => { navigate('/user/profile'); setShowProfileMenu(false); }}
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <span className="dropdown-item-icon"><IconUser /></span>
                      Mi Perfil
                    </button>
                    <button
                      onClick={() => { navigate('/user/settings'); setShowProfileMenu(false); }}
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <span className="dropdown-item-icon"><IconSliders /></span>
                      Configuración
                    </button>
                    <div className="dropdown-divider" />
                    <button onClick={handleLogout} className="dropdown-item logout-item" role="menuitem">
                      <span className="dropdown-item-icon"><IconLogout /></span>
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          

          {/* Backdrop para el panel móvil */}
          <div
            className="nav-backdrop"
            hidden={!isNavOpen}
            onClick={() => closeNav(true)}
            aria-hidden="true"
          />
        </header>

        <main className="user-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout;