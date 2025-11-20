import { useState } from 'react';

interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
}

export const useCloudinary = () => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true);
    setError(null);

    try {
      // Validaciones
      if (!file.type.startsWith('image/')) {
        throw new Error('El archivo debe ser una imagen');
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('La imagen no debe superar 2MB');
      }

      // Preparar FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'profiles');

      // Subir a Cloudinary
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

      const data: CloudinaryResponse = await response.json();
      return data.secure_url;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al subir imagen';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return { uploadImage, uploading, error };
};
