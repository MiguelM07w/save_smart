import React, { useState, forwardRef, useId, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { loginSchema } from '../../validations/auth.validation';
import Button from '../../components/common/Button';
import type { LoginRequest } from '../../types';
import './styles/LoginPage.css';

/* SVG inline para el ícono de ojo (mostrar/ocultar) */
const EyeIcon = ({ off = false, size = 18 }: { off?: boolean; size?: number }) => {
  if (off) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.12-.88M9.88 4.24A11.6 11.6 0 0112 4c7 0 11 8 11 8a18.1 18.1 0 01-3.06 4.18M6.06 6.06A18.1 18.1 0 001 12s4 8 11 8a11.5 11.5 0 005.06-1.06" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
};

/* Input con label flotante y toggle de contraseña (sin dependencias de iconos) */
type LoginInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  togglePassword?: boolean;
};

const LoginInput = forwardRef<HTMLInputElement, LoginInputProps>(
  ({ label, type = 'text', error, id, togglePassword, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id || `fld-${autoId}`;
    const [show, setShow] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className={`form-field${error ? ' has-error' : ''}`}>
        <input
          id={inputId}
          ref={ref}
          type={isPassword && show ? 'text' : type}
          className="form-input"
          placeholder=" "                 /* necesario para :placeholder-shown */
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>

        {isPassword && togglePassword && (
          <button
            type="button"
            className="password-toggle"
            aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            onClick={() => setShow((s) => !s)}
            title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <EyeIcon off={show} />
          </button>
        )}

        {error && (
          <span id={`${inputId}-error`} className="input-error" role="alert">
            {error}
          </span>
        )}
      </div>
    );
  }
);
LoginInput.displayName = 'LoginInput';

const LoginPage: React.FC = () => {
  const { login, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(loginSchema),
  });

  // Aplica el fondo animado SOLO cuando este componente está montado
  useEffect(() => {
    document.body.classList.add('has-animated-bg');
    return () => {
      document.body.classList.remove('has-animated-bg');
    };
  }, []);

  const onSubmit = async (data: LoginRequest) => {
    await login(data);
  };

  return (
    <>
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h2>SaveSmart</h2>
            <h3>Iniciar Sesión</h3>
            <p>Ingresa tus datos para acceder al sistema</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <LoginInput
              {...register('email')}
              type="email"
              label="Correo electrónico"
              error={errors.email?.message}
              autoComplete="email"
              inputMode="email"
            />

            <LoginInput
              {...register('password')}
              type="password"
              label="Contraseña"
              error={errors.password?.message}
              autoComplete="current-password"
              togglePassword
            />

            <div className="form-options">
              <label className="checkbox-label">
                <input type="checkbox" />
                <span>Recordarme</span>
              </label>

              <Link to="/forgot-password" className="link-text forgot">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={isLoading}
              className="login-btn"
              style={{ width: '100%' }}
            >
              Iniciar Sesión
            </Button>
          </form>

          <div className="login-footer">
            <p>
              ¿No tienes cuenta?{' '}
              <Link to="/register" className="link-primary">
                Regístrate aquí
              </Link>
            </p>
          </div>

          <div className="login-divider">
            <span>o</span>
          </div>

          <button
            type="button"
            className="google-login-btn"
            onClick={() => window.location.href = 'http://localhost:3000/savesmarth/api/v1/login/google'}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.59.102-1.167.282-1.707V4.96H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.04l3.007-2.333z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
            </svg>
            Continuar con Google
          </button>

          <div className="login-back">
            <Link to="/" className="link-text">
              ← Volver al inicio
            </Link>
          </div>
        </div>
      </div>

      {/* Capas de olas (no bloquean clics) */}
      <div className="waves" aria-hidden="true">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
};

export default LoginPage;