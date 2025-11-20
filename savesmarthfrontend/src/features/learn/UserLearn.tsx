import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { videosApi, articlesApi } from '../../services/api.service';
import type { Video, Article } from '../../types';
import VideoCard from '../videos/VideoCard';
import ArticleCard from '../articles/ArticleCard';
import VideoPlayer from '../videos/VideoPlayer';
import ArticleReader from '../articles/ArticleReader';
import './UserLearn.css';

type TabType = 'videos' | 'tips';

const UserLearn: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('videos');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch published videos
  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ['published-videos'],
    queryFn: videosApi.getPublished,
  });

  // Fetch published tips (articles of type 'tip' or 'guia')
  const { data: allArticles = [], isLoading: loadingArticles } = useQuery({
    queryKey: ['published-articles'],
    queryFn: articlesApi.getPublished,
  });

  const tips = allArticles.filter(a => a.type === 'tip' || a.type === 'guia');

  const categories = [
    'Todos',
    'Presupuesto',
    'Ahorro',
    'Inversión',
    'Deudas',
    'Educación Financiera',
    'Tips',
  ];

  // Filter content
  const filterContent = <T extends Video | Article>(items: T[]): T[] => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' ||
        item.category === selectedCategory ||
        selectedCategory === 'Todos';

      const matchesSearch = !searchTerm ||
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ('excerpt' in item && item.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  };

  const filteredVideos = filterContent(videos);
  const filteredTips = filterContent(tips);

  const isLoading = activeTab === 'videos' ? loadingVideos : loadingArticles;
  const currentItems = activeTab === 'videos' ? filteredVideos : filteredTips;

  return (
    <div className="user-learn-page">
      <div className="learn-header">
        <div>
          <h1>📚 Aprende</h1>
          <p>Mejora tus conocimientos sobre finanzas personales</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => setActiveTab('videos')}
        >
          📺 Videos ({videos.length})
        </button>
        <button
          className={`tab ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          💡 Tips y Guías ({tips.length})
        </button>
      </div>

      {/* Search and Filters */}
      <div className="filters-section">
        <input
          type="text"
          className="search-input"
          placeholder={`Buscar ${activeTab === 'videos' ? 'videos' : 'tips'}...`}
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

      {/* Content Grid */}
      {isLoading ? (
        <div className="loading">Cargando contenido...</div>
      ) : currentItems.length > 0 ? (
        <div className={activeTab === 'videos' ? 'videos-grid' : 'articles-grid'}>
          {activeTab === 'videos'
            ? filteredVideos.map(video => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={setSelectedVideo}
                />
              ))
            : filteredTips.map(article => (
                <ArticleCard
                  key={article._id}
                  article={article}
                  onClick={setSelectedArticle}
                />
              ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">
            {activeTab === 'videos' ? '📺' : '💡'}
          </span>
          <p>No se encontraron {activeTab === 'videos' ? 'videos' : 'tips'}</p>
          {searchTerm && (
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

      {/* Video Player Modal */}
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
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

export default UserLearn;
