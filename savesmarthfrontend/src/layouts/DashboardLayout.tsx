import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import './styles/DashboardLayout.css';

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>SaveSmarth</h2>
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>

        <nav className="sidebar-nav">
          {user?.rol === 'Administrador' ? (
            <>
              <NavLink to="/admin/dashboard" end className="nav-item">
                <span className="nav-icon">📊</span>
                {sidebarOpen && <span>Dashboard</span>}
              </NavLink>

              <NavLink to="/admin/income" className="nav-item">
                <span className="nav-icon">💰</span>
                {sidebarOpen && <span>Ingresos</span>}
              </NavLink>

              <NavLink to="/admin/expenses" className="nav-item">
                <span className="nav-icon">💸</span>
                {sidebarOpen && <span>Gastos</span>}
              </NavLink>

              <NavLink to="/admin/users" className="nav-item">
                <span className="nav-icon">👥</span>
                {sidebarOpen && <span>Usuarios</span>}
              </NavLink>

              <NavLink to="/admin/payments" className="nav-item">
                <span className="nav-icon">💳</span>
                {sidebarOpen && <span>Pagos</span>}
              </NavLink>

              <NavLink to="/admin/videos" className="nav-item">
                <span className="nav-icon">📺</span>
                {sidebarOpen && <span>Videos</span>}
              </NavLink>

              <NavLink to="/admin/articles" className="nav-item">
                <span className="nav-icon">📰</span>
                {sidebarOpen && <span>Artículos</span>}
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/user/dashboard" end className="nav-item">
                <span className="nav-icon">📊</span>
                {sidebarOpen && <span>Mi Dashboard</span>}
              </NavLink>

              <NavLink to="/user/income" className="nav-item">
                <span className="nav-icon">💰</span>
                {sidebarOpen && <span>Mis Ingresos</span>}
              </NavLink>

              <NavLink to="/user/expenses" className="nav-item">
                <span className="nav-icon">💸</span>
                {sidebarOpen && <span>Mis Gastos</span>}
              </NavLink>
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.photo ? (
                <img src={user.photo} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : (
                user?.username?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            {sidebarOpen && (
              <div className="user-info">
                <p className="user-name">{user?.username}</p>
                <p className="user-role">{user?.rol}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1>Panel de Control</h1>
          </div>

          <div className="header-right">
            <button className="btn btn-sm" onClick={() => navigate(user?.rol === 'Administrador' ? '/admin/profile' : '/user/profile')}>
              <span>👤</span> Perfil
            </button>
            <button className="btn btn-sm" onClick={() => navigate(user?.rol === 'Administrador' ? '/admin/settings' : '/user/settings')}>
              <span>⚙️</span> Configuración
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleLogout}>
              <span>🚪</span> Salir
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
