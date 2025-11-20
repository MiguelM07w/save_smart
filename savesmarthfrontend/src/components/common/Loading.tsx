import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
}

const Loading: React.FC<LoadingProps> = ({ fullScreen = false, message = 'Cargando...' }) => {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto', marginBottom: '1rem' }} />
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <div className="spinner" style={{ margin: '0 auto', marginBottom: '1rem' }} />
      <p>{message}</p>
    </div>
  );
};

export default Loading;
