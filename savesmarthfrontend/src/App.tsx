import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './store';
import { queryClient } from './config/react-query.config';
import { useAppDispatch } from './store/hooks';
import { initializeAuth } from './store/slices/authSlice';
import { initializeNotifications } from './store/slices/notificationSlice';
import AppRoutes from './routes';

// Import global styles
import './assets/styles/global.css';

// Inner component to use hooks
const AppInitializer: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth and notifications from localStorage on app mount
    dispatch(initializeAuth());
    dispatch(initializeNotifications());
  }, [dispatch]);

  return <AppRoutes />;
};

// Placeholder Component for incomplete pages
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
    <h1>{title}</h1>
    <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
      Esta página está en construcción. Usa el módulo de Estudiantes como template para crear esta sección.
    </p>
    <div style={{ marginTop: '2rem' }}>
      <p>Para crear esta página, replica la estructura de:</p>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        <li>✓ <code>features/students/StudentsPage.tsx</code></li>
        <li>✓ <code>features/students/StudentForm.tsx</code></li>
        <li>✓ <code>features/students/StudentsPage.css</code></li>
      </ul>
      <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
        Adapta los campos según el schema del módulo correspondiente.
      </p>
    </div>
  </div>
);

// Main App Component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppInitializer />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
