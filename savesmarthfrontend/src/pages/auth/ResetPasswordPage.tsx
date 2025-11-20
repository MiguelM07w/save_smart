import React, { useState, useId, forwardRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import './styles/ResetPasswordPage.css';

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

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ label, error, id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id || `fld-${autoId}`;
    const [show, setShow] = useState(false);

    return (
      <div className={`rp-field${error ? ' has-error' : ''}`}>
        <input
          id={inputId}
          ref={ref}
          type={show ? 'text' : 'password'}
          className="rp-input"
          placeholder=" "
          {...rest}
        />
        <label htmlFor={inputId} className="rp-label">
          {label}
        </label>
        <button
          type="button"
          className="rp-password-toggle"
          onClick={() => setShow(!show)}
          aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        >
          <EyeIcon off={show} />
        </button>
        {error && <span className="rp-error">{error}</span>}
      </div>
    );
  }
);

const resetPasswordSchema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .required('La contraseña es requerida'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Las contraseñas no coinciden')
    .required('Confirma tu contraseña'),
});

type ResetPasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

const BG_BOXES = 84; // rombos suficientes para pantallas grandes

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: yupResolver(resetPasswordSchema),
  });

  const Bg = () => (
    <div className="rp-bg" aria-hidden="true">
      {Array.from({ length: BG_BOXES }).map((_, i) => (
        <span key={i} className="rp-box" />
      ))}
    </div>
  );

  if (!token) {
    return (
      <div className="rp-page">
        <Bg />
        <div className="rp-container">
          <div className="rp-card rp-animate-in">
            <div className="rp-header">
              <h1 className="rp-title">❌ Token Inválido</h1>
              <p className="rp-subtitle">
                El enlace de recuperación no es válido o ha expirado.
              </p>
            </div>
            <Link to="/forgot-password" className="rp-back-link">
              ← Solicitar nuevo enlace
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetPasswordForm) => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/savesmarth/api/v1/login/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Contraseña actualizada exitosamente');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      } else {
        toast.error(result.message || 'Error al actualizar la contraseña');
      }
    } catch (error) {
      toast.error('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">
      <Bg />
      <div className="rp-container">
        <div className="rp-card rp-animate-in">
          <div className="rp-header">
            <h1 className="rp-title">Restablecer Contraseña</h1>
            <p className="rp-subtitle">Ingresa tu nueva contraseña</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rp-form" noValidate>
            <PasswordInput
              {...register('newPassword')}
              label="Nueva Contraseña"
              error={errors.newPassword?.message}
              autoComplete="new-password"
            />

            <PasswordInput
              {...register('confirmPassword')}
              label="Confirmar Contraseña"
              error={errors.confirmPassword?.message}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="rp-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="rp-btn-spinner" aria-hidden="true"></span>
                  Actualizando...
                </>
              ) : (
                'Actualizar Contraseña'
              )}
            </button>
          </form>

          <div className="rp-footer">
            <Link to="/login" className="rp-back-link">
              ← Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;