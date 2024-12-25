import React, { useEffect, useState, useCallback } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const ArtistRecommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [seedArtist, setSeedArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ setError] = useState(null);

  const getRecommendations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const topArtists = await SpotifyApi.getTopArtists('long_term', 1);
      console.log("Got top artists:", topArtists);
      
      if (!topArtists?.items?.length) {
        throw new Error("No top artists found");
      }
      
      const seedArtist = topArtists.items[0];
      setSeedArtist(seedArtist);
      
      const artistDetails = await SpotifyApi.getRecommendedArtists(seedArtist.id);
      
      if (artistDetails?.artists?.length) {
        setRecommendations(artistDetails.artists);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error("Failed to get recommendations:", error);
      setError("Couldn't load recommendations right now");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getRecommendations();
  }, [getRecommendations]);

  if (loading) {
    return (
      <div className="section-content" style={{
        backgroundColor: '#282828',
        padding: '30px',
        borderRadius: '12px',
        color: '#b3b3b3',
        textAlign: 'center'
      }}>
        Finding your next favorite artists...
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
        fontSize: '28px',
        textAlign: 'center',
        marginBottom: '20px',
        color: '#1DB954'
      }}>
        Artists You Might Love
      </h3>

      {seedArtist && recommendations.length > 0 && (
        <div style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#b3b3b3'
        }}>
          Based on your love for <span style={{ color: '#fff', fontWeight: 'bold' }}>{seedArtist.name}</span>
        </div>
      )}

      {recommendations.length > 0 ? (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          padding: '20px'
        }}>
          {recommendations.map((artist, index) => (
            <div 
              key={artist.id || index}
              style={{
                backgroundColor: '#1a1a1a',
                padding: '25px',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.backgroundColor = '#222';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.backgroundColor = '#1a1a1a';
              }}
            >
              {artist.images?.[0] && (
                <img 
                  src={artist.images[0].url}
                  alt={artist.name}
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginBottom: '20px',
                    border: '4px solid #1DB954',
                    boxShadow: '0 4px 10px rgba(29, 185, 84, 0.3)'
                  }}
                />
              )}
              <h4 style={{ 
                fontSize: '22px',
                marginBottom: '12px',
                color: '#ffffff'
              }}>
                {artist.name}
              </h4>
              {artist.genres?.length > 0 && (
                <div style={{ 
                  color: '#1DB954',
                  fontSize: '16px',
                  marginBottom: '12px',
                  fontWeight: 'bold'
                }}>
                  {artist.genres.slice(0, 2).join(' • ')}
                </div>
              )}
              <div style={{ 
                color: '#b3b3b3',
                fontSize: '14px'
              }}>
                {artist.followers?.total?.toLocaleString() || 'N/A'} followers
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', color: '#b3b3b3' }}>
          No recommendations available right now
        </div>
      )}
    </div>
  );
};

export default ArtistRecommendations;