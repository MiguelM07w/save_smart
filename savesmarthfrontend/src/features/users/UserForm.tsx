import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCloudinary } from '../../hooks/useCloudinary';
import { usersApi } from '../../services/api.service';
import type { Login } from '../../types';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

interface UserFormProps {
  user: Login | null;
  onClose: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!user;
  const { uploadImage, uploading: uploadingPhoto } = useCloudinary();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    rol: 'Usuario',
    photo: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        password: '', // No mostrar password
        rol: user.rol || 'Usuario',
        photo: user.photo || '',
      });
      setPhotoPreview(user.photo || null);
    }
  }, [user]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Login>) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario creado exitosamente');
      onClose();
    },
    onError: () => {
      toast.error('Error al crear usuario');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Login>) => usersApi.update(user!._id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast.success('Usuario actualizado exitosamente');
      onClose();
    },
    onError: () => {
      toast.error('Error al actualizar usuario');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.email) {
      toast.error('Usuario y email son requeridos');
      return;
    }

    if (!isEditing && !formData.password) {
      toast.error('La contraseña es requerida para nuevos usuarios');
      return;
    }

    const data: Partial<Login> = {
      username: formData.username,
      email: formData.email,
      rol: formData.rol,
      photo: formData.photo,
    };

    // Solo enviar password si se especificó
    if (formData.password) {
      data.password = formData.password;
    }

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);

      const loadingToast = toast.loading('Subiendo foto...');
      const photoUrl = await uploadImage(file);
      toast.dismiss(loadingToast);
      toast.success('Foto subida exitosamente');

      setFormData(prev => ({ ...prev, photo: photoUrl }));
      setPhotoPreview(photoUrl);
    } catch {
      toast.error('Error al subir foto');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* Foto de Perfil */}
          <div className="form-section">
            <h3>Foto de Perfil</h3>
            <div className="photo-upload-section">
              <div className="photo-preview">
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" className="preview-image" />
                ) : (
                  <div className="preview-placeholder">
                    <span>{formData.username?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                )}
              </div>
              <div className="photo-upload-controls">
                <label htmlFor="photo-input" className={`photo-upload-label ${uploadingPhoto ? 'is-loading' : ''}`}>
                  {uploadingPhoto ? 'Subiendo...' : 'Seleccionar Foto'}
                </label>
                <input
                  id="photo-input"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  disabled={uploadingPhoto}
                  className="photo-input"
                />
                <small className="form-hint">Máximo 2MB</small>
              </div>
            </div>
          </div>

          {/* Información del Usuario */}
          <div className="form-section">
            <h3>Información del Usuario</h3>
            <div className="form-group">
              <label>Nombre de Usuario *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Ingrese nombre de usuario"
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div className="form-group">
              <label>{isEditing ? 'Nueva Contraseña (Opcional)' : 'Contraseña *'}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={isEditing ? 'Dejar en blanco para no cambiar' : 'Ingrese contraseña'}
                required={!isEditing}
              />
            </div>

            <div className="form-group">
              <label>Rol *</label>
              <select name="rol" value={formData.rol} onChange={handleChange} required>
                <option value="Usuario">Usuario</option>
                <option value="Administrador">Administrador</option>
              </select>
            </div>
          </div>

          <div className="form-actions">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
