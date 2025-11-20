import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../../hooks/useAuth';
import { useCloudinary } from '../../hooks/useCloudinary';
import { authApi } from '../../services/api.service';
import type { Login } from '../../types';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import '../../pages/user/styles/UserProfile.css'; // Reutilizar estilos

// Íconos inline
const SfCamera = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true" focusable="false">
    <rect x="3" y="7" width="18" height="12" rx="3" />
    <path d="M9 7l1.4-2h3.2L15 7" />
    <circle cx="12" cy="13" r="3.8" />
  </svg>
);

const SfSpinner = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" opacity="0.25" />
    <path d="M21 12a9 9 0 0 0-9-9" />
  </svg>
);

const SfCheckCircle = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
    className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="9" />
    <path d="M8.2 12.6l2.6 2.6L16 10" />
  </svg>
);

const AdminProfile: React.FC = () => {
  const auth = useAuth() as any;
  const authUser = auth.user;
  const setAuthUser = auth.setUser as ((u: any) => void) | undefined;

  const { uploadImage, uploading: uploadingPhoto } = useCloudinary();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    photo: '',
    newPassword: '',
  });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (authUser) {
      setFormData({
        username: authUser.username || '',
        email: authUser.email || '',
        photo: authUser.photo || '',
        newPassword: '',
      });
      setPhotoPreview(authUser.photo || null);
    }
  }, [authUser]);

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Login>) => authApi.updateProfile(authUser?._id || '', data),
    onSuccess: (response) => {
      const updatedUser = (response as any)?.user || response;

      if (setAuthUser) {
        setAuthUser(updatedUser);
      }

      setFormData((prev) => ({
        ...prev,
        username: updatedUser.username ?? prev.username,
        email: updatedUser.email ?? prev.email,
        photo: updatedUser.photo ?? prev.photo,
        newPassword: '',
      }));

      if (updatedUser.photo) {
        setPhotoPreview(updatedUser.photo);
      }

      toast.success('Perfil actualizado exitosamente');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Error al actualizar perfil';
      toast.error(errorMessage);
    },
  });

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Por favor selecciona una imagen');
    if (file.size > 2 * 1024 * 1024) return toast.error('La imagen no debe superar 2MB');

    try {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);

      const loadingToast = toast.loading('Subiendo foto...');
      const photoUrl = await uploadImage(file);
      toast.dismiss(loadingToast);
      toast.success('Foto cargada. Presiona "Guardar Cambios" para confirmar');

      setFormData((prev) => ({ ...prev, photo: photoUrl }));
      setPhotoPreview(photoUrl);
    } catch {
      toast.error('Error al subir foto');
      setPhotoPreview(formData.photo || null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') return;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim()) {
      toast.error('El nombre de usuario es requerido');
      return;
    }

    const payload: Partial<Login> = {
      username: formData.username,
      email: formData.email,
      photo: formData.photo,
    };

    if (formData.newPassword) {
      payload.password = formData.newPassword;
    }

    updateMutation.mutate(payload);
  };

  return (
    <div className="user-profile">
      <style>{`
        .up-non-editable[readonly]{background:#f6f7fb;color:#64748b;cursor:default}
        .up-non-editable[readonly]:focus{border-color:#e2e8f0;box-shadow:none}
        .profile-btn{display:inline-flex;align-items:center;justify-content:center;gap:.5rem}
        .up-icon,.up-btn-icon{width:18px;height:18px;color:currentColor}
        .up-spin{animation:up-spin 1s linear infinite}
        @keyframes up-spin{to{transform:rotate(360deg)}}
      `}</style>

      <div className="profile-header">
        <div className="header-content">
          <div className="profile-avatar">
            {photoPreview ? (
              <img src={photoPreview} alt="Profile" className="avatar-image" />
            ) : (
              <span>{(formData.username || authUser?.username || 'A').charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div>
            <h1>Mi Perfil (Administrador)</h1>
            <p>Actualiza tu información personal</p>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          {/* Foto de Perfil */}
          <div className="form-section">
            <h2 className="section-title">Foto de Perfil</h2>
            <div className="photo-upload-section">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="preview-image" />
                ) : (
                  <div className="preview-placeholder">
                    <span>{(formData.username || authUser?.username || 'A').charAt(0).toUpperCase()}</span>
                  </div>
                )}
              </div>
              <div className="photo-upload-controls">
                <label htmlFor="photo-input" className={`photo-upload-label ${uploadingPhoto ? 'is-loading' : ''}`}>
                  {uploadingPhoto ? (
                    <>
                      <SfSpinner className="up-icon up-spin" /> Subiendo...
                    </>
                  ) : (
                    <>
                      <SfCamera className="up-icon" /> Seleccionar Foto
                    </>
                  )}
                </label>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                  className="photo-input"
                />
                <small className="form-hint">Máximo 2MB. Los cambios se guardan al presionar "Guardar Cambios"</small>
              </div>
            </div>
          </div>

          {/* Información de Cuenta */}
          <div className="form-section">
            <h2 className="section-title">Información de Cuenta</h2>
            <div className="form-group">
              <label>Usuario</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
              />
            </div>
            <div className="form-group">
              <label>Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                aria-readonly="true"
                title="Este correo no puede editarse"
                placeholder="correo@ejemplo.com"
                className="up-non-editable"
                required
              />
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="form-section">
            <h2 className="section-title">Cambiar Contraseña</h2>
            <div className="form-group">
              <label>Nueva Contraseña (Opcional)</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData((p) => ({ ...p, newPassword: e.target.value }))}
                placeholder="Dejar en blanco para no cambiar"
              />
              <small className="form-hint">Solo completa este campo si deseas cambiar tu contraseña</small>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="submit"
              variant="primary"
              disabled={updateMutation.isPending}
              className="profile-btn"
              style={{ width: '100%' }}
            >
              {updateMutation.isPending ? (
                <>
                  <SfSpinner className="up-btn-icon up-spin" /> Guardando...
                </>
              ) : (
                <>
                  <SfCheckCircle className="up-btn-icon" /> Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
