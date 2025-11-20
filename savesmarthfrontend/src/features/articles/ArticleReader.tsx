import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { articlesApi } from '../../services/api.service';
import type { Article } from '../../types';
import './articles.css';

interface ArticleReaderProps {
  article: Article;
  onClose: () => void;
}

const ArticleReader: React.FC<ArticleReaderProps> = ({ article, onClose }) => {
  const incrementViewsMutation = useMutation({
    mutationFn: (id: string) => articlesApi.incrementViews(id),
  });

  useEffect(() => {
    if (article._id) {
      // Increment views when article is opened
      incrementViewsMutation.mutate(article._id);
    }
  }, [article._id]);

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Handle headings
        if (paragraph.startsWith('# ')) {
          return <h2 key={index}>{paragraph.substring(2)}</h2>;
        }
        if (paragraph.startsWith('## ')) {
          return <h3 key={index}>{paragraph.substring(3)}</h3>;
        }
        if (paragraph.startsWith('### ')) {
          return <h4 key={index}>{paragraph.substring(4)}</h4>;
        }

        // Handle bold and italic
        let formattedParagraph = paragraph
          .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.+?)\*/g, '<em>$1</em>');

        return (
          <p key={index} dangerouslySetInnerHTML={{ __html: formattedParagraph }} />
        );
      });
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'tip': return 'badge-tip';
      case 'noticia': return 'badge-noticia';
      case 'guia': return 'badge-guia';
      default: return 'badge-default';
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="article-reader-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        {article.coverImage && (
          <div className="article-cover">
            <img src={article.coverImage} alt={article.title} />
          </div>
        )}

        <div className="article-reader-content">
          <div className="article-header">
            <span className={`article-type-badge ${getTypeBadgeClass(article.type)}`}>
              {article.type === 'tip' ? '💡 Tip' :
               article.type === 'noticia' ? '📰 Noticia' :
               '📚 Guía'}
            </span>
            <h1>{article.title}</h1>

            <div className="article-meta">
              {article.author && <span className="article-author">✍️ {article.author}</span>}
              {article.readingTime && <span>⏱️ {article.readingTime} min de lectura</span>}
              {article.category && (
                <span className="article-category">{article.category}</span>
              )}
            </div>

            {article.excerpt && (
              <p className="article-excerpt-reader">{article.excerpt}</p>
            )}
          </div>

          <div className="article-body">
            {formatContent(article.content)}
          </div>

          {article.tags && article.tags.length > 0 && (
            <div className="article-tags">
              {article.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {article.externalUrl && (
            <div className="external-link">
              <a
                href={article.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="external-link-btn"
              >
                🔗 Ver fuente original
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleReader;
