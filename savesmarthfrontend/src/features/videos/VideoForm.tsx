import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { videosApi } from '../../services/api.service';
import type { Video } from '../../types';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';
import { extractYoutubeId, getYoutubeThumbnail } from '../../utils/youtube';

interface VideoFormProps {
  video: Video | null;
  onClose: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ video, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!video;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: 'Presupuesto',
    level: 'principiante',
    tags: '',
    author: '',
    isPublished: true,
    isFeatured: false,
  });

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        youtubeId: video.youtubeId || '',
        category: video.category || 'Presupuesto',
        level: video.level || 'principiante',
        tags: video.tags?.join(', ') || '',
        author: video.author || '',
        isPublished: video.isPublished ?? true,
        isFeatured: video.isFeatured ?? false,
      });
    }
  }, [video]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Video>) => videosApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video creado exitosamente');
      onClose();
    },
    onError: () => toast.error('Error al crear video'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Video>) => videosApi.update(video!._id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video actualizado exitosamente');
      onClose();
    },
    onError: () => toast.error('Error al actualizar video'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.youtubeId) {
      toast.error('Título y YouTube ID son requeridos');
      return;
    }

    // Extract clean YouTube ID
    const cleanYoutubeId = extractYoutubeId(formData.youtubeId);

    // Validate the extracted ID
    if (!/^[a-zA-Z0-9_-]{11}$/.test(cleanYoutubeId)) {
      toast.error('YouTube ID inválido. Debe ser de 11 caracteres o una URL válida de YouTube');
      return;
    }

    const data: Partial<Video> = {
      title: formData.title,
      description: formData.description,
      youtubeId: cleanYoutubeId,
      category: formData.category,
      level: formData.level,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      author: formData.author,
      isPublished: formData.isPublished,
      isFeatured: formData.isFeatured,
      thumbnail: getYoutubeThumbnail(cleanYoutubeId),
    };

    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Editar Video' : '➕ Nuevo Video'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Información del Video</h3>

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Cómo hacer un presupuesto mensual"
                required
              />
            </div>

            <div className="form-group">
              <label>Descripción *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el contenido del video..."
                rows={3}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>YouTube ID o URL *</label>
                <input
                  type="text"
                  name="youtubeId"
                  value={formData.youtubeId}
                  onChange={handleChange}
                  placeholder="dQw4w9WgXcQ o https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  required
                />
                <small>Puedes pegar la URL completa de YouTube o solo el ID del video (11 caracteres)</small>
              </div>
              <div className="form-group">
                <label>Autor</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nombre del autor o canal"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Categoría</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="Presupuesto">Presupuesto</option>
                  <option value="Ahorro">Ahorro</option>
                  <option value="Inversión">Inversión</option>
                  <option value="Deudas">Deudas</option>
                  <option value="Educación Financiera">Educación Financiera</option>
                  <option value="Tips">Tips</option>
                </select>
              </div>
              <div className="form-group">
                <label>Nivel</label>
                <select name="level" value={formData.level} onChange={handleChange}>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="presupuesto, ahorro, finanzas (separados por comas)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isPublished"
                    checked={formData.isPublished}
                    onChange={handleChange}
                  />
                  <span>Publicado</span>
                </label>
              </div>
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                  />
                  <span>Destacado</span>
                </label>
              </div>
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
                : 'Crear Video'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;
