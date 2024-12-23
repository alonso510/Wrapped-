import React, { useEffect, useState } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const MusicEvolution = () => {
  const [timeRanges, setTimeRanges] = useState({
    short_term: null,   // Last 4 weeks
    medium_term: null,  // Last 6 months
    long_term: null    // All time
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeRangeData = async () => {
      try {
        // Fetch data for all time ranges
        const [shortTerm, mediumTerm, longTerm] = await Promise.all([
          SpotifyApi.getTopArtists('short_term', 10),
          SpotifyApi.getTopArtists('medium_term', 10),
          SpotifyApi.getTopArtists('long_term', 10)
        ]);

        setTimeRanges({
          short_term: shortTerm,
          medium_term: mediumTerm,
          long_term: longTerm
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching evolution data:", error);
        setLoading(false);
      }
    };

    fetchTimeRangeData();
  }, []);

  const renderArtistList = (artists, timeRange) => {
    const timeLabels = {
      short_term: "Last 4 Weeks",
      medium_term: "Last 6 Months",
      long_term: "All Time"
    };

    return (
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        flex: 1
      }}>
        <h4 style={{ 
          color: '#1DB954', 
          marginBottom: '15px',
          fontSize: '18px'
        }}>
          {timeLabels[timeRange]}
        </h4>
        {artists.items.map((artist, index) => (
          <div key={artist.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '10px',
            padding: '10px',
            backgroundColor: '#282828',
            borderRadius: '8px',
          }}>
            {artist.images[0] && (
              <img 
                src={artist.images[0].url}
                alt={artist.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: 'bold' }}>
                {index + 1}. {artist.name}
              </div>
              <div style={{ 
                fontSize: '12px',
                color: '#b3b3b3',
                marginTop: '4px'
              }}>
                {artist.genres.slice(0, 2).join(', ')}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="section-content">Analyzing your music evolution...</div>;
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
        Your Music Evolution
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {Object.entries(timeRanges).map(([timeRange, data]) => (
          data && renderArtistList(data, timeRange)
        ))}
      </div>

      {/* Analysis section */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '30px'
      }}>
        <h4 style={{ color: '#1DB954', marginBottom: '15px' }}>Evolution Insights</h4>
        <div style={{ color: '#b3b3b3' }}>
          Compare your listening patterns across different time periods to see how your music taste has evolved.
        </div>
      </div>
    </div>
  );
};

export default MusicEvolution;