import React, { useEffect, useState, useRef } from 'react';

const GenreDiversity = ({ topArtists }) => {
  const [genreData, setGenreData] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [artistsInGenre, setArtistsInGenre] = useState([]);
  const containerRef = useRef(null);
  const artistsRef = useRef(null);
  const COLORS = ['#1DB954', '#1ed760', '#169c46', '#0d5c29', '#2de26d', '#107a37'];

  // Intersection Observer for scroll animation
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

  // Process genre data
  useEffect(() => {
    if (topArtists?.items) {
      const allGenres = topArtists.items.reduce((acc, artist) => {
        return [...acc, ...artist.genres];
      }, []);

      const genreCounts = allGenres.reduce((acc, genre) => {
        acc[genre] = (acc[genre] || 0) + 1;
        return acc;
      }, {});

      const sortedGenres = Object.entries(genreCounts)
        .map(([name, value]) => ({
          name: name.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          value
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

      setGenreData(sortedGenres);
    }
  }, [topArtists]);

  const handleGenreClick = (genre) => {
    // If same genre clicked, close it
    if (selectedGenre?.name === genre.name) {
      setSelectedGenre(null);
      setArtistsInGenre([]);
      return;
    }

    setSelectedGenre(genre);
    const artists = topArtists.items.filter(artist => 
      artist.genres.includes(genre.name.toLowerCase())
    );
    setArtistsInGenre(artists);

    // Smooth scroll to artists section
    setTimeout(() => {
      artistsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  const maxValue = Math.max(...genreData.map(genre => genre.value));

  return (
    <div 
      ref={containerRef}
      style={{ 
        backgroundColor: '#282828', 
        padding: '30px',
        margin: '20px',
        borderRadius: '12px',
        color: 'white',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
      }}
    >
      <h3 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
        Your Year in Genres
      </h3>

      <div style={{ 
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>

{genreData.map((genre, i) => (
  <div
    key={genre.name}
    onClick={() => handleGenreClick(genre)}
    style={{
      backgroundColor: COLORS[i],
      width: `${(genre.value / maxValue) * 200}px`,
      height: `${(genre.value / maxValue) * 200}px`,
      borderRadius: '50%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '10px',  // Reduced padding
      textAlign: 'center',
      color: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      animation: isVisible ? `fadeIn 0.6s ease-out ${i * 0.2}s forwards` : 'none',
      opacity: 0,
      transform: selectedGenre?.name === genre.name ? 'scale(1.1)' : 'scale(0.8)',
      boxShadow: selectedGenre?.name === genre.name ? '0 0 20px rgba(29, 185, 84, 0.5)' : 'none',
    }}
  >
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '4px',
      maxWidth: '80%'  // Constrain text width
    }}>
      <span style={{ 
        fontWeight: 'bold',
        fontSize: `${Math.max((genre.value / maxValue) * 16, 12)}px`,  // Responsive font size
        wordBreak: 'break-word',
        lineHeight: '1.2'
      }}>
        {genre.name}
      </span>
      <span style={{ 
        fontSize: `${Math.max((genre.value / maxValue) * 14, 10)}px`,  // Smaller font for count
        opacity: 0.9 
      }}>
        {genre.value} {genre.value === 1 ? 'Artist' : 'Artists'}
      </span>
    </div>
  </div>
))}
      </div>

      {/* Artists Section */}
      <div
        ref={artistsRef}
        style={{
          maxHeight: selectedGenre ? '800px' : '0',
          overflow: 'hidden',
          transition: 'all 0.5s ease-in-out',
          marginTop: selectedGenre ? '20px' : '0',
        }}
      >
        {selectedGenre && (
          <div style={{
            padding: '20px',
            backgroundColor: '#1a1a1a',
            borderRadius: '12px',
            maxHeight: '700px',  // Added max-height
            overflowY: 'auto',   // Added scroll for overflow
          }}>
            <h4 style={{ marginBottom: '20px', color: COLORS[0], position: 'sticky', top: 0, backgroundColor: '#1a1a1a', padding: '10px 0' }}>
              Top Artists in {selectedGenre.name}
            </h4>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: '15px',
              paddingBottom: '20px',
            }}>
              {artistsInGenre.map(artist => (
                <div 
                  key={artist.id} 
                  style={{
                    padding: '15px',
                    backgroundColor: '#282828',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    transition: 'transform 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  {artist.images?.[0] && (
                    <img 
                      src={artist.images[0].url} 
                      alt={artist.name}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                      }}
                    />
                  )}
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{artist.name}</div>
                    <div style={{ fontSize: '14px', color: '#b3b3b3' }}>
                      {artist.followers.total.toLocaleString()} followers
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add this to your CSS or App.css if not already present
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.8);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`;
document.head.appendChild(style);

export default GenreDiversity;