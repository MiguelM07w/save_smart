import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/slices/authSlice';
import './styles/GoogleCallbackPage.css';

const GoogleCallbackPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Obtener datos del usuario desde URL
        const userDataEncoded = searchParams.get('user');

        if (!userDataEncoded) {
          throw new Error('No se recibieron datos del usuario');
        }

        // Decodificar datos
        const userData = JSON.parse(decodeURIComponent(userDataEncoded));

        if (!userData || !userData.token) {
          throw new Error('Datos de autenticación inválidos');
        }

        // Guardar en Redux y localStorage
        dispatch(setUser(userData));
        localStorage.setItem('userSaveSmarth', JSON.stringify(userData));

        // Redirigir según el rol
        if (userData.rol === 'Administrador') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/user', { replace: true });
        }
      } catch (error) {
        console.error('Error en callback de Google:', error);
        navigate('/login?error=google_callback_failed', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, dispatch]);

  return (
    <div className="google-callback-container">
      <div className="google-callback-card">
        <div className="spinner"></div>
        <h2>Autenticando con Google...</h2>
        <p>Por favor espera mientras completamos tu inicio de sesión</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;
