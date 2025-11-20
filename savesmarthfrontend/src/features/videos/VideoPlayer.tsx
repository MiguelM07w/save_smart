import React, { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { videosApi } from '../../services/api.service';
import type { Video } from '../../types';
import { getYoutubeEmbedUrl } from '../../utils/youtube';
import './videos.css';

interface VideoPlayerProps {
  video: Video;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  const incrementViewsMutation = useMutation({
    mutationFn: (id: string) => videosApi.incrementViews(id),
  });

  useEffect(() => {
    if (video._id) {
      // Incrementar vistas cuando se abre el video
      incrementViewsMutation.mutate(video._id);
    }
  }, [video._id]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="video-player-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="video-player-container">
          <iframe
            width="100%"
            height="100%"
            src={getYoutubeEmbedUrl(video.youtubeId, true)}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="video-details">
          <h2>{video.title}</h2>
          <p>{video.description}</p>
          {video.tags && video.tags.length > 0 && (
            <div className="video-tags">
              {video.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
