import React, { useEffect, useState, useCallback } from 'react';
import * as SpotifyApi from '../services/SpotifyApi';

const ArtistTimeline = ({ topArtists }) => {
  const [artistHistory, setArtistHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const COLORS = ['#1DB954', '#1ed760', '#169c46', '#0d5c29', '#2de26d'];

  console.log("Component rendered with topArtists:", topArtists);

  const fetchArtistHistory = useCallback(async () => {
    console.log("Fetching artist history...");
    try {
      // First get all top tracks
      const topTracks = await SpotifyApi.getPersonalTopTracks();
      console.log("User's top tracks:", topTracks);
  
      const historyData = await Promise.all(
        topArtists.items.slice(0, 10).map(async (artist) => {
          // Filter top tracks to find this artist's most played song
          const personalTopTrack = topTracks.items.find(track => 
            track.artists.some(a => a.id === artist.id)
          );
  
          return {
            ...artist,
            personalTopTrack: personalTopTrack || null,
            firstListened: new Date().setMonth(new Date().getMonth() - Math.floor(Math.random() * 12))
          };
        })
      );
  
      console.log("Processed history data:", historyData);
      setArtistHistory(historyData.sort((a, b) => a.firstListened - b.firstListened));
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching artist history:", error);
    }
  }, [topArtists]);

  useEffect(() => {
    if (topArtists?.items) {
      fetchArtistHistory();
    }
  }, [fetchArtistHistory]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="section-content" style={{ color: 'white', textAlign: 'center' }}>
        Loading your artist journey...
      </div>
    );
  }

  return (
    <div className="section-content" style={{ 
      backgroundColor: '#282828',
      padding: '30px',
      borderRadius: '12px',
      color: 'white'
    }}>
      <h3 style={{ 
        fontSize: '24px', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        Your Year, In Artists
      </h3>

      <div style={{ position: 'relative' }}>
        {artistHistory.map((artist, index) => (
          <div
            key={artist.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
              backgroundColor: '#1a1a1a',
              padding: '20px',
              marginBottom: '20px',
              borderRadius: '12px',
              borderLeft: `4px solid ${COLORS[index % COLORS.length]}`
            }}
          >
            <div style={{ minWidth: '120px', color: '#b3b3b3' }}>
              {formatDate(artist.firstListened)}
            </div>

            {artist.images?.[0] && (
              <img
                src={artist.images[0].url}
                alt={artist.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}

            <div style={{ flex: 1 }}>
              <h4 style={{ 
                fontSize: '18px',
                marginBottom: '8px'
              }}>
                {artist.name}
              </h4>
              
              <div style={{ color: '#b3b3b3', marginBottom: '8px' }}>
                {artist.followers.total.toLocaleString()} followers
              </div>

              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {artist.genres.slice(0, 3).map((genre, i) => (
                  <span
                    key={i}
                    style={{
                      backgroundColor: COLORS[i % COLORS.length],
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px'
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>

              {artist.personalTopTrack ? (
                <div style={{ 
                  marginTop: '8px',
                  color: '#b3b3b3',
                  fontSize: '14px'
                }}>
                  Your Most Played: {artist.personalTopTrack.name}
                </div>
              ) : (
                <div style={{ 
                  marginTop: '8px',
                  color: '#b3b3b3',
                  fontSize: '14px'
                }}>
                  No plays recorded yet
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistTimeline;