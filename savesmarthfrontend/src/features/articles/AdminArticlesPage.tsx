import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesApi } from '../../services/api.service';
import type { Article } from '../../types';
import toast from 'react-hot-toast';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import { usePagination } from '../../hooks/usePagination';
import ArticleForm from './ArticleForm';
import './AdminArticlesPage.css';

const AdminArticlesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch all articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['admin-articles'],
    queryFn: articlesApi.getAll,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => articlesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo eliminado exitosamente');
    },
    onError: () => {
      toast.error('Error al eliminar artículo');
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => articlesApi.restore(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-articles'] });
      toast.success('Artículo restaurado exitosamente');
    },
    onError: () => {
      toast.error('Error al restaurar artículo');
    },
  });

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setShowForm(true);
  };

  const handleDelete = (article: Article) => {
    if (window.confirm(`¿Estás seguro de eliminar "${article.title}"?`)) {
      deleteMutation.mutate(article._id!);
    }
  };

  const handleRestore = (article: Article) => {
    restoreMutation.mutate(article._id!);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedArticle(null);
  };

  // Filter articles
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeArticles = filteredArticles.filter(a => !a.deletedAt);
  const deletedArticles = filteredArticles.filter(a => a.deletedAt);

  // Pagination for active articles
  const {
    currentPage: activeCurrentPage,
    totalPages: activeTotalPages,
    paginatedItems: paginatedActiveArticles,
    goToPage: goToActivePage,
    resetPage: resetActivePage,
    totalItems: activeTotalItems,
    itemsPerPage: activeItemsPerPage,
  } = usePagination(activeArticles, 10);

  // Pagination for deleted articles
  const {
    currentPage: deletedCurrentPage,
    totalPages: deletedTotalPages,
    paginatedItems: paginatedDeletedArticles,
    goToPage: goToDeletedPage,
    resetPage: resetDeletedPage,
    totalItems: deletedTotalItems,
    itemsPerPage: deletedItemsPerPage,
  } = usePagination(deletedArticles, 10);

  // Reset pages when search changes
  useEffect(() => {
    resetActivePage();
    resetDeletedPage();
  }, [searchTerm, resetActivePage, resetDeletedPage]);

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'tip': return 'badge-tip';
      case 'noticia': return 'badge-noticia';
      case 'guia': return 'badge-guia';
      default: return 'badge-default';
    }
  };

  if (isLoading) {
    return <div className="loading">Cargando artículos...</div>;
  }

  return (
    <div className="admin-articles-page">
      <div className="page-header">
        <div>
          <h1>📰 Gestión de Artículos</h1>
          <p>Administra tips, noticias y guías de finanzas personales</p>
        </div>
        <Button variant="primary" onClick={() => setShowForm(true)}>
          ➕ Nuevo Artículo
        </Button>
      </div>

      {/* Search */}
      <div className="search-section">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar por título, tipo, categoría o contenido..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <span className="search-stats">
          {activeArticles.length} artículo{activeArticles.length !== 1 ? 's' : ''} activo{activeArticles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Active Articles Table */}
      {activeArticles.length > 0 ? (
        <div className="table-container">
          <table className="articles-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Título</th>
                <th>Tipo</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Vistas</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedActiveArticles.map(article => (
                <tr key={article._id}>
                  <td>
                    {article.coverImage ? (
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="article-preview"
                      />
                    ) : (
                      <div className="article-preview-placeholder">
                        {article.type === 'tip' ? '💡' : article.type === 'noticia' ? '📰' : '📚'}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="article-cell">
                      <strong>{article.title}</strong>
                      {article.author && <small>por {article.author}</small>}
                      {article.excerpt && (
                        <small className="excerpt">
                          {article.excerpt.length > 60
                            ? article.excerpt.substring(0, 60) + '...'
                            : article.excerpt}
                        </small>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(article.type)}`}>
                      {article.type === 'tip' ? '💡 Tip' :
                       article.type === 'noticia' ? '📰 Noticia' :
                       '📚 Guía'}
                    </span>
                  </td>
                  <td>
                    <span className="badge badge-category">{article.category}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${article.isPublished ? 'status-published' : 'status-draft'}`}>
                      {article.isPublished ? '✅ Publicado' : '📝 Borrador'}
                    </span>
                  </td>
                  <td>{article.views || 0}</td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(article)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(article)}
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

          {/* Pagination for active articles */}
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
          <span className="empty-icon">📰</span>
          <p>No hay artículos disponibles</p>
          <Button variant="primary" onClick={() => setShowForm(true)}>
            Crear primer artículo
          </Button>
        </div>
      )}

      {/* Deleted Articles */}
      {deletedArticles.length > 0 && (
        <>
          <h2 className="section-title">🗑️ Artículos Eliminados ({deletedArticles.length})</h2>
          <div className="table-container">
            <table className="articles-table">
              <thead>
                <tr>
                  <th>Título</th>
                  <th>Tipo</th>
                  <th>Categoría</th>
                  <th>Eliminado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDeletedArticles.map(article => (
                  <tr key={article._id} className="deleted-row">
                    <td>{article.title}</td>
                    <td>
                      <span className={`badge ${getTypeBadgeClass(article.type)}`}>
                        {article.type}
                      </span>
                    </td>
                    <td>{article.category}</td>
                    <td>{new Date(article.deletedAt!).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-icon btn-restore"
                        onClick={() => handleRestore(article)}
                        title="Restaurar"
                      >
                        ♻️ Restaurar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination for deleted articles */}
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

      {/* Article Form Modal */}
      {showForm && (
        <ArticleForm
          article={selectedArticle}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default AdminArticlesPage;
