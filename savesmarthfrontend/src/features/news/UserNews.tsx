import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { articlesApi } from '../../services/api.service';
import type { Article } from '../../types';
import ArticleCard from '../articles/ArticleCard';
import ArticleReader from '../articles/ArticleReader';
import './UserNews.css';

const UserNews: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch published news (articles of type 'noticia')
  const { data: allArticles = [], isLoading } = useQuery({
    queryKey: ['published-news'],
    queryFn: articlesApi.getPublished,
  });

  const news = allArticles.filter(a => a.type === 'noticia');

  const categories = [
    'Todos',
    'Presupuesto',
    'Ahorro',
    'Inversión',
    'Deudas',
    'Educación Financiera',
    'Tips',
  ];

  // Filter news
  const filteredNews = news.filter(article => {
    const matchesCategory = selectedCategory === 'all' ||
      article.category === selectedCategory ||
      selectedCategory === 'Todos';

    const matchesSearch = !searchTerm ||
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Sort by date (newest first)
  const sortedNews = [...filteredNews].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="user-news-page">
      <div className="news-header">
        <div>
          <h1>📰 Noticias</h1>
          <p>Mantente al día con las últimas noticias de finanzas personales</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <input
          type="text"
          className="search-input"
          placeholder="Buscar noticias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-filter ${
                (category === 'Todos' && selectedCategory === 'all') ||
                category === selectedCategory
                  ? 'active'
                  : ''
              }`}
              onClick={() => setSelectedCategory(category === 'Todos' ? 'all' : category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      {!isLoading && (
        <div className="news-stats">
          <span>
            {sortedNews.length} noticia{sortedNews.length !== 1 ? 's' : ''} disponible{sortedNews.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* News Grid */}
      {isLoading ? (
        <div className="loading">Cargando noticias...</div>
      ) : sortedNews.length > 0 ? (
        <div className="articles-grid">
          {sortedNews.map(article => (
            <ArticleCard
              key={article._id}
              article={article}
              onClick={setSelectedArticle}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📰</span>
          <p>No se encontraron noticias</p>
          {(searchTerm || selectedCategory !== 'all') && (
            <button
              className="clear-filters"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Limpiar filtros
            </button>
          )}
        </div>
      )}

      {/* Article Reader Modal */}
      {selectedArticle && (
        <ArticleReader
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default UserNews;
