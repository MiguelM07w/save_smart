import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
// Removido: import Button from '../../components/common/Button';
import './styles/ForgotPasswordPage.css';

const forgotPasswordSchema = yup.object({
  email: yup.string().email('Email inválido').required('El email es requerido'),
});

type ForgotPasswordForm = {
  email: string;
};

const BG_BOXES = 84; // más elementos para cubrir pantallas grandes

const ForgotPasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/savesmarth/api/v1/login/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setEmailSent(true);
        toast.success('Se ha enviado un correo de recuperación a tu email');
      } else {
        toast.error(result.message || 'Error al enviar el correo');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Componente de fondo con rombos
  const Bg = () => (
    <div className="fp-bg" aria-hidden="true">
      {Array.from({ length: BG_BOXES }).map((_, i) => (
        <span key={i} className="fp-box" style={{ '--i': i } as React.CSSProperties} />
      ))}
    </div>
  );

  if (emailSent) {
    return (
      <div className="fp-page">
        <Bg />
        <div className="fp-container">
          <div className="fp-card fp-animate-in">
            <div className="fp-header">
              <div className="fp-icon fp-success">
                <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
                  <defs>
                    <linearGradient id="fp-g-success" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                  </defs>
                  <path fill="url(#fp-g-success)" d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm4.59 7.17l-5.66 5.66a1 1 0 01-1.41 0l-2.12-2.12a1 1 0 111.41-1.41l1.41 1.41 4.95-4.95a1 1 0 111.41 1.41z"/>
                </svg>
              </div>
              <h1 className="fp-title">Correo enviado</h1>
              <p className="fp-subtitle">
                Revisa tu bandeja de entrada y haz clic en el enlace para restablecer tu contraseña.
              </p>
            </div>

            <div className="fp-success-alert" role="status" aria-live="polite">
              <p>Si no ves el correo, revisa tu carpeta de spam.</p>
            </div>

            <Link to="/login" className="fp-back-link">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fp-page">
      <Bg />
      <div className="fp-container">
        <div className="fp-card fp-animate-in">
          <div className="fp-header">
            <div className="fp-icon">
              <svg width="44" height="44" viewBox="0 0 24 24" aria-hidden="true">
                <defs>
                  <linearGradient id="fp-g-lock" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <path fill="url(#fp-g-lock)" d="M17 8h-1V6a4 4 0 10-8 0v2H7a2 2 0 00-2 2v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2zM9 6a3 3 0 116 0v2H9V6zm8 12H7v-8h10v8z"/>
              </svg>
            </div>
            <h1 className="fp-title">¿Olvidaste tu contraseña?</h1>
            <p className="fp-subtitle">
              Ingresa tu correo electrónico y te enviaremos un enlace para restablecerla.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="fp-form" noValidate>
            <div className={`fp-field${errors.email ? ' has-error' : ''}`}>
              <input
                {...register('email')}
                type="email"
                className="fp-input"
                placeholder=" "
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              <label className="fp-label">Email</label>
              {errors.email && <span id="email-error" className="fp-error">{errors.email.message}</span>}
            </div>

            <button
              type="submit"
              className="fp-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="fp-btn-spinner" aria-hidden="true"></span>
                  Enviando...
                </>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>

          <div className="fp-footer">
            <Link to="/login" className="fp-back-link">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;