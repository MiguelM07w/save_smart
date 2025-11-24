import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../../services/api.service';
import Loading from '../../components/common/Loading';
import './styles/NewsPage.css';

const NewsPage: React.FC = () => {
  const [newsType, setNewsType] = useState<'financial' | 'business'>('financial');

  const { data: newsData, isLoading, error } = useQuery({
    queryKey: ['news', newsType],
    queryFn: () => newsType === 'financial'
      ? newsApi.getFinancialNews(1, 12)
      : newsApi.getBusinessNews('mx', 12),
    retry: 1,
  });

  if (isLoading) return <Loading />;

  if (error) {
    return (
      <div className="news-page">
        <div className="error-message">
          <h2>Error al cargar noticias</h2>
          <p>No se pudieron cargar las noticias en este momento. Por favor, intenta más tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="page-header">
        <div>
          <h1>Noticias Financieras</h1>
          <p>Mantente informado con las últimas noticias sobre finanzas y economía</p>
        </div>
      </div>

      <div className="news-tabs">
        <button
          className={`tab-button ${newsType === 'financial' ? 'active' : ''}`}
          onClick={() => setNewsType('financial')}
        >
          Finanzas Personales
        </button>
        <button
          className={`tab-button ${newsType === 'business' ? 'active' : ''}`}
          onClick={() => setNewsType('business')}
        >
          Negocios
        </button>
      </div>

      <div className="news-grid">
        {newsData?.articles && newsData.articles.length > 0 ? (
          newsData.articles.map((article, index) => (
            <div key={index} className="news-card">
              {article.urlToImage && (
                <div className="news-image">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-news.png';
                    }}
                  />
                </div>
              )}
              <div className="news-content">
                <div className="news-source">{article.source}</div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-description">{article.description || 'No hay descripción disponible'}</p>
                <div className="news-footer">
                  <span className="news-date">
                    {new Date(article.publishedAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="news-link"
                  >
                    Leer más →
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-news">
            <p>No hay noticias disponibles en este momento.</p>
          </div>
        )}
      </div>

      {newsData && newsData.totalResults > 0 && (
        <div className="news-info">
          <p>Mostrando {newsData.articles.length} de {newsData.totalResults} noticias</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
