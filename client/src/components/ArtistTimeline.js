import React, { useEffect, useState, useRef } from 'react';

const ArtistTimeline = ({ topArtists }) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);
  const COLORS = ['#1DB954', '#1ed760', '#169c46', '#0d5c29', '#2de26d'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderTimelineItem = (artist, index) => (
    <div
      key={artist.id}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
        transition: `all 0.5s ease ${index * 0.1}s`,
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '12px',
        margin: '10px 0',
        borderLeft: `4px solid ${COLORS[index % COLORS.length]}`,
      }}
    >
      {artist.images?.[0] && (
        <img
          src={artist.images[0].url}
          alt={artist.name}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      )}
      <div>
        <h3 style={{ marginBottom: '8px' }}>{artist.name}</h3>
        <div style={{ color: '#b3b3b3', fontSize: '14px' }}>
          {artist.followers.total.toLocaleString()} followers
        </div>
        <div style={{ 
          backgroundColor: COLORS[index % COLORS.length],
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '12px',
          marginTop: '8px',
          fontSize: '12px'
        }}>
          Top Genre: {artist.genres[0] || 'N/A'}
        </div>
      </div>
    </div>
  );

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: '#282828',
        padding: '30px',
        margin: '20px',
        borderRadius: '12px',
        color: 'white',
      }}
    >
      <h3 style={{ fontSize: '24px', marginBottom: '30px', textAlign: 'center' }}>
        Your Artist Journey
      </h3>

      <div style={{
        position: 'relative',
        paddingLeft: '20px',
      }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '0',
          top: '0',
          bottom: '0',
          width: '2px',
          backgroundColor: '#1DB954',
          opacity: 0.3,
        }} />

        {topArtists?.items?.slice(0, 10).map((artist, index) => (
          renderTimelineItem(artist, index)
        ))}
      </div>
    </div>
  );
};

export default ArtistTimeline;