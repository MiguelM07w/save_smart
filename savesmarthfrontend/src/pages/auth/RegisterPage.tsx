import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema } from '../../validations/auth.validation';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import type { RegisterRequest } from '../../types';
import './styles/RegisterPage.css';

interface RegisterFormData extends RegisterRequest {
  confirmPassword: string;
}

/* SVG inline para el ojo (on/off) */
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

const RegisterPage: React.FC = () => {
  const { register: registerUser, isLoading } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema) as any, // Temporal fix para el tipo
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Aplica el fondo animado SOLO cuando este componente está montado
  useEffect(() => {
    document.body.classList.add('has-animated-bg');
    return () => {
      document.body.classList.remove('has-animated-bg');
    };
  }, []);

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;

    try {
      await registerUser(registerData);
    } catch (error: any) {
      if (error.response?.status === 400) {
        const message = error.response.data.message || 'El usuario ya existe';
        toast.error(message);
      } else if (error.response?.status === 409) {
        toast.error('El nombre de usuario ya está registrado');
      } else {
        toast.error('Error al registrar el usuario. Intenta de nuevo más tarde.');
      }
    }
  };

  return (
    <>
      <div className="register-container">
        <div className="register-card">
          <div className="register-header">
            <h2>SaveSmart</h2>
            <h3>Crear Cuenta</h3>
            <p>Completa el formulario para registrarte</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="register-form">
            <Input
              {...register('username')}
              type="text"
              label="Usuario"
              placeholder="Tu usuario"
              error={errors.username?.message}
              autoComplete="username"
            />

            <Input
              {...register('email')}
              type="email"
              label="Email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              autoComplete="email"
            />

            <div className="form-grid">
              <div className="input-wrapper">
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  label="Contraseña"
                  placeholder="••••••••"
                  error={errors.password?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowPassword((s) => !s)}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>

              <div className="input-wrapper">
                <Input
                  {...register('confirmPassword')}
                  type={showConfirm ? 'text' : 'password'}
                  label="Confirmar Contraseña"
                  placeholder="••••••••"
                  error={errors.confirmPassword?.message}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  title={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShowConfirm((s) => !s)}
                >
                  <EyeIcon off={showConfirm} />
                </button>
              </div>
            </div>

            <input type="hidden" {...register('rol')} value="Usuario" />

            <div className="terms-checkbox">
              <input 
                type="checkbox" 
                id="terms" 
                required 
              />
              <label htmlFor="terms">
                Acepto los{' '}
                <Link to="/terms" className="link-text">
                  términos y condiciones
                </Link>
              </label>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              loading={isLoading}
              className="register-btn" 
              style={{ width: '100%' }}
            >
              Crear Cuenta
            </Button>
          </form>

          <div className="register-footer">
            <p>
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="link-primary">
                Inicia sesión aquí
              </Link>
            </p>
          </div>

          <div className="register-divider">
            <span>o</span>
          </div>

          <div className="register-back">
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

export default RegisterPage;