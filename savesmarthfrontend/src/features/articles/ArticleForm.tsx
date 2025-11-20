import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '../../services/api.service';
import type { Article } from '../../types';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

interface ArticleFormProps {
  article: Article | null;
  onClose: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ article, onClose }) => {
  const queryClient = useQueryClient();
  const isEditing = !!article;

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    type: 'tip',
    category: 'Presupuesto',
    level: 'principiante',
    tags: '',
    author: '',
    externalUrl: '',
    isPublished: true,
    isFeatured: false,
  });

  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (article) {
      setFormData({
        title: article.title || '',
        slug: article.slug || '',
        excerpt: article.excerpt || '',
        content: article.content || '',
        type: article.type || 'tip',
        category: article.category || 'Presupuesto',
        level: article.level || 'principiante',
        tags: article.tags?.join(', ') || '',
        author: article.author || '',
        externalUrl: article.externalUrl || '',
        isPublished: article.isPublished ?? true,
        isFeatured: article.isFeatured ?? false,
      });
      setCoverImage(article.coverImage || null);
    }
  }, [article]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<Article>) => articlesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo creado exitosamente');
      onClose();
    },
    onError: () => toast.error('Error al crear artículo'),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Article>) => articlesApi.update(article!._id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo actualizado exitosamente');
      onClose();
    },
    onError: () => toast.error('Error al actualizar artículo'),
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, 'a')
      .replace(/[éèëê]/g, 'e')
      .replace(/[íìïî]/g, 'i')
      .replace(/[óòöô]/g, 'o')
      .replace(/[úùüû]/g, 'u')
      .replace(/ñ/g, 'n')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      toast.error('El archivo debe ser una imagen');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('La imagen no debe superar 2MB');
      return;
    }

    setImageFile(file);

    // Preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', 'articles');

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Error al subir imagen');
    }

    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Título y contenido son requeridos');
      return;
    }

    try {
      let uploadedImageUrl = coverImage;

      // Upload new image if selected
      if (imageFile) {
        setUploadingImage(true);
        uploadedImageUrl = await uploadToCloudinary(imageFile);
        setUploadingImage(false);
      }

      const data: Partial<Article> = {
        title: formData.title,
        slug: formData.slug || generateSlug(formData.title),
        excerpt: formData.excerpt,
        content: formData.content,
        type: formData.type,
        category: formData.category,
        level: formData.level,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        author: formData.author,
        externalUrl: formData.externalUrl || undefined,
        coverImage: uploadedImageUrl || undefined,
        isPublished: formData.isPublished,
        isFeatured: formData.isFeatured,
      };

      if (isEditing) {
        updateMutation.mutate(data);
      } else {
        createMutation.mutate(data);
      }
    } catch (error) {
      setUploadingImage(false);
      toast.error('Error al procesar el artículo');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Auto-generate slug from title
    if (name === 'title' && !isEditing) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(value),
      }));
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending || uploadingImage;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content article-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditing ? '✏️ Editar Artículo' : '➕ Nuevo Artículo'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-section">
            <h3>Información Básica</h3>

            <div className="form-group">
              <label>Título *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: 5 consejos para ahorrar dinero"
                required
              />
            </div>

            <div className="form-group">
              <label>Slug (URL) *</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="5-consejos-para-ahorrar-dinero"
                required
              />
              <small>Se genera automáticamente del título, pero puedes personalizarlo</small>
            </div>

            <div className="form-group">
              <label>Resumen / Extracto</label>
              <textarea
                name="excerpt"
                value={formData.excerpt}
                onChange={handleChange}
                placeholder="Breve descripción del artículo..."
                rows={2}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tipo *</label>
                <select name="type" value={formData.type} onChange={handleChange} required>
                  <option value="tip">💡 Tip</option>
                  <option value="noticia">📰 Noticia</option>
                  <option value="guia">📚 Guía</option>
                </select>
              </div>
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Nivel</label>
                <select name="level" value={formData.level} onChange={handleChange}>
                  <option value="principiante">Principiante</option>
                  <option value="intermedio">Intermedio</option>
                  <option value="avanzado">Avanzado</option>
                </select>
              </div>
              <div className="form-group">
                <label>Autor</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="Nombre del autor"
                />
              </div>
            </div>

            {formData.type === 'noticia' && (
              <div className="form-group">
                <label>URL Externa (para noticias)</label>
                <input
                  type="url"
                  name="externalUrl"
                  value={formData.externalUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/noticia"
                />
                <small>Opcional: enlace a la fuente original de la noticia</small>
              </div>
            )}
          </div>

          <div className="form-section">
            <h3>Contenido</h3>

            <div className="form-group">
              <label>Contenido * (Markdown soportado)</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Escribe el contenido del artículo aquí... Puedes usar Markdown para formato."
                rows={12}
                required
                className="content-textarea"
              />
              <small>Usa Markdown para formato: **negrita**, *cursiva*, # Título, etc.</small>
            </div>

            <div className="form-group">
              <label>Imagen de Portada</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
              />
              <small>Máximo 2MB. Recomendado: 1200x630px</small>

              {coverImage && (
                <div className="image-preview">
                  <img src={coverImage} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={() => {
                      setCoverImage(null);
                      setImageFile(null);
                    }}
                  >
                    ✕ Quitar imagen
                  </button>
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="ahorro, presupuesto, tips (separados por comas)"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Configuración</h3>

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
            <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {uploadingImage
                ? 'Subiendo imagen...'
                : isSubmitting
                ? 'Guardando...'
                : isEditing
                ? 'Actualizar'
                : 'Crear Artículo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ArticleForm;
