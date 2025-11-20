import React from 'react';
import type { Video } from '../../types';
import { getYoutubeThumbnail } from '../../utils/youtube';
import './videos.css';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const thumbnail = video.thumbnail || getYoutubeThumbnail(video.youtubeId);

  return (
    <div className="video-card" onClick={() => onClick(video)}>
      <div className="video-thumbnail">
        <img src={thumbnail} alt={video.title} loading="lazy" />
        {video.durationFormatted && (
          <span className="video-duration">{video.durationFormatted}</span>
        )}
        <div className="play-overlay">
          <span className="play-icon">▶</span>
        </div>
      </div>
      <div className="video-info">
        <h3 className="video-title">{video.title}</h3>
        <p className="video-description">
          {video.description.length > 100
            ? video.description.substring(0, 100) + '...'
            : video.description}
        </p>
        <div className="video-meta">
          <span className="video-category">{video.category}</span>
          {video.level && (
            <span className={`video-level level-${video.level}`}>
              {video.level}
            </span>
          )}
          {video.views !== undefined && video.views > 0 && (
            <span className="video-views">
              👁️ {video.views} vista{video.views !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
