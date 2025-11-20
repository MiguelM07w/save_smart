import React from 'react';
import type { Article } from '../../types';
import './articles.css';

interface ArticleCardProps {
  article: Article;
  onClick: (article: Article) => void;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick }) => {
  const defaultImage = 'https://via.placeholder.com/400x250/667eea/ffffff?text=SaveSmart';

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'tip':
        return 'badge-tip';
      case 'noticia':
        return 'badge-noticia';
      case 'guia':
        return 'badge-guia';
      default:
        return 'badge-default';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'tip':
        return '💡 Tip';
      case 'noticia':
        return '📰 Noticia';
      case 'guia':
        return '📚 Guía';
      default:
        return type;
    }
  };

  return (
    <div className="article-card" onClick={() => onClick(article)}>
      {article.coverImage && (
        <div className="article-image">
          <img
            src={article.coverImage || defaultImage}
            alt={article.title}
            loading="lazy"
          />
        </div>
      )}
      <div className="article-content">
        <div className={`article-type-badge ${getTypeBadgeClass(article.type)}`}>
          {getTypeLabel(article.type)}
        </div>
        <h3 className="article-title">{article.title}</h3>
        {article.excerpt && (
          <p className="article-excerpt">{article.excerpt}</p>
        )}
        <div className="article-meta">
          <span className="article-author">✍️ {article.author}</span>
          {article.readingTime && (
            <span className="reading-time">⏱️ {article.readingTime} min</span>
          )}
          {article.views !== undefined && article.views > 0 && (
            <span className="article-views">
              👁️ {article.views} vista{article.views !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
