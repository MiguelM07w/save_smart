import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';
import UserLayout from '../layouts/UserLayout';

// Public Pages
import LandingPage from '../pages/landing/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import GoogleCallbackPage from '../pages/auth/GoogleCallbackPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import AdminProfile from '../pages/admin/AdminProfile';
import IncomePage from '../features/income/IncomePage';
import ExpensePage from '../features/expense/ExpensePage';
import UsersPage from '../features/users/UsersPage';
import PaymentsPage from '../features/payments/PaymentsPage';
import AdminVideosPage from '../features/videos/AdminVideosPage';
import AdminArticlesPage from '../features/articles/AdminArticlesPage';

// User Pages
import UserHome from '../pages/user/UserHome';
import UserForms from '../pages/user/UserForms';
import UserCharts from '../pages/user/UserCharts';
import UserDashboard from '../pages/user/UserDashboard';
import UserLearn from '../features/learn/UserLearn';
import UserNews from '../features/news/UserNews';
import NewsPage from '../pages/user/NewsPage';
import UserPayments from '../features/payments/UserPayments';
import UserProfile from '../pages/user/UserProfile';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isInitialized } = useAppSelector((state) => state.auth);

  // IMPORTANTE: Esperar a que se inicialice antes de verificar autenticación
  if (!isInitialized) {
    // Mostrar un loading simple mientras se verifica localStorage
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'var(--bg-primary, #f8fafc)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #e2e8f0',
            borderTop: '3px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  // Solo después de inicializar, verificar si está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main Routes Component
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/auth/google/callback" element={<GoogleCallbackPage />} />

      {/* Admin Routes - Protected */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="income" element={<IncomePage />} />
        <Route path="expenses" element={<ExpensePage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="videos" element={<AdminVideosPage />} />
        <Route path="articles" element={<AdminArticlesPage />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="settings" element={<AdminProfile />} />
      </Route>

      {/* User Routes - Protected */}
      <Route
        path="/user"
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/user/home" replace />} />
        <Route path="home" element={<UserHome />} />
        <Route path="forms" element={<UserForms />} />
        <Route path="charts" element={<UserCharts />} />
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="learn" element={<UserLearn />} />
        <Route path="news" element={<UserNews />} />
        <Route path="external-news" element={<NewsPage />} />
        <Route path="payments" element={<UserPayments />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="settings" element={<UserProfile />} />
      </Route>

      {/* Legacy dashboard redirect */}
      <Route path="/dashboard" element={<Navigate to="/user/dashboard" replace />} />

      {/* 404 Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
