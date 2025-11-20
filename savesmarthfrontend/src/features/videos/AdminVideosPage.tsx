import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { videosApi } from '../../services/api.service';
import type { Video } from '../../types';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import VideoForm from './VideoForm';
import { getYoutubeThumbnail } from '../../utils/youtube';
import './AdminVideosPage.css';

const AdminVideosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: videosApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => videosApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar video');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => videosApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('Video restaurado exitosamente');
    },
    onError: () => {
      toast.error('Error al restaurar video');
    },
  });

  const handleEdit = (video: Video) => {
    setSelectedVideo(video);
    setShowForm(true);
  };

  const handleDelete = (video: Video) => {
    if (window.confirm(`¿Estás seguro de eliminar "${video.title}"?`)) {
      deleteMutation.mutate(video._id!);
    }
  };

  const handleRestore = (video: Video) => {
    restoreMutation.mutate(video._id!);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedVideo(null);
  };

  // Filter videos
  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeVideos = filteredVideos.filter(v => !v.deletedAt);
  const deletedVideos = filteredVideos.filter(v => v.deletedAt);

  // Pagination for active videos
  const {
    currentPage: activeCurrentPage,
    totalPages: activeTotalPages,
    paginatedItems: paginatedActiveVideos,
    goToPage: goToActivePage,
    resetPage: resetActivePage,
    totalItems: activeTotalItems,
    itemsPerPage: activeItemsPerPage,
  } = usePagination(activeVideos, 10);

  // Pagination for deleted videos
  const {
    currentPage: deletedCurrentPage,
    totalPages: deletedTotalPages,
    paginatedItems: paginatedDeletedVideos,
    goToPage: goToDeletedPage,
    resetPage: resetDeletedPage,
    totalItems: deletedTotalItems,
    itemsPerPage: deletedItemsPerPage,
  } = usePagination(deletedVideos, 10);

  // Reset pages when search changes
  useEffect(() => {
    resetActivePage();
    resetDeletedPage();
  }, [searchTerm, resetActivePage, resetDeletedPage]);

  if (isLoading) {
    return <div className="loading">Cargando videos...</div>;
  }

  return (
    <div className="admin-videos-page">
      <div className="page-header">
        <div>
          <h1>📺 Gestión de Videos</h1>
          <p>Administra el contenido educativo de la plataforma</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Nuevo Video
        </Button>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, descripción o categoría..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-stats">
          {activeVideos.length} video{activeVideos.length !== 1 ? 's' : ''} activo{activeVideos.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Active Videos Table */}
      {activeVideos.length > 0 ? (
        <div className="table-container">
          <table className="videos-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Título</th>
                <th>Categoría</th>
                <th>Nivel</th>
                <th>Estado</th>
                <th>Vistas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActiveVideos.map(video => (
                <tr key={video._id}>
                  <td>
                    <img
                      src={video.thumbnail || getYoutubeThumbnail(video.youtubeId, 'default')}
                      alt={video.title}
                      className="video-preview"
                    />
                  </td>
                  <td>
                    <div className="video-cell">
                      <strong>{video.title}</strong>
                      {video.author && <small>por {video.author}</small>}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-category">{video.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${video.level}`}>{video.level}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${video.isPublished ? 'status-published' : 'status-draft'}`}>
                      {video.isPublished ? '✅ Publicado' : '📝 Borrador'}
                    </span>
                  </td>
                  <td>{video.views || 0}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(video)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(video)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination for active videos */}
          <Pagination
            currentPage={activeCurrentPage}
            totalPages={activeTotalPages}
            totalItems={activeTotalItems}
            itemsPerPage={activeItemsPerPage}
            onPageChange={goToActivePage}
          />
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📺</span>
          <p>No hay videos disponibles</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Crear primer video
          </Button>
        </div>
      )}

      {/* Deleted Videos */}
      {deletedVideos.length > 0 && (
        <>
          <h2 className="section-title">🗑️ Videos Eliminados ({deletedVideos.length})</h2>
          <div className="table-container">
            <table className="videos-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Categoría</th>
                  <th>Eliminado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeletedVideos.map(video => (
                  <tr key={video._id} className="deleted-row">
                    <td>{video.title}</td>
                    <td>{video.category}</td>
                    <td>{new Date(video.deletedAt!).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-icon btn-restore"
                        onClick={() => handleRestore(video)}
                        title="Restaurar"
                      >
                        ♻️ Restaurar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination for deleted videos */}
            <Pagination
              currentPage={deletedCurrentPage}
              totalPages={deletedTotalPages}
              totalItems={deletedTotalItems}
              itemsPerPage={deletedItemsPerPage}
              onPageChange={goToDeletedPage}
            />
          </div>
        </>
      )}

      {/* Video Form Modal */}
      {showForm && (
        <VideoForm
          video={selectedVideo}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default AdminVideosPage;
