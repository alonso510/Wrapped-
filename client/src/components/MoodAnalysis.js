import React, { useState, useEffect, useCallback } from 'react';
import * as SpotifyApi from '../services/SpotifyApi';

const MoodAnalysis = () => {
  const [tracks, setTracks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMoodData = useCallback(async () => {
    try {
      console.log("Starting mood analysis fetch...");
      const tracksWithFeatures = await SpotifyApi.getTracksWithAudioFeatures();
      console.log("Got tracks with features:", tracksWithFeatures);
      setTracks(tracksWithFeatures);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching mood data:", error);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMoodData();
  }, [fetchMoodData]);

  if (isLoading) {
    return (
      <div className="section-content" style={{ 
        backgroundColor: '#282828',
        padding: '30px',
        borderRadius: '12px',
        color: 'white',
        textAlign: 'center'
      }}>
        Analyzing your music moods...
      </div>
    );
  }

  // Basic stats calculation
  const averageStats = tracks.reduce((acc, track) => {
    // Check if track and audioFeatures exist and are not null
    if (track?.audioFeatures?.valence !== undefined) {
        acc.valence += track.audioFeatures.valence || 0;
        acc.energy += track.audioFeatures.energy || 0;
        acc.danceability += track.audioFeatures.danceability || 0;
        acc.validTracks++; // Count only tracks with valid features
    }
    return acc;
}, { valence: 0, energy: 0, danceability: 0, validTracks: 0 });

// Then calculate averages using validTracks count instead of total tracks
const validTracks = averageStats.validTracks || 1; // Prevent division by zero
const avgValence = (averageStats.valence / validTracks) * 100;
const avgEnergy = (averageStats.energy / validTracks) * 100;
const avgDanceability = (averageStats.danceability / validTracks) * 100;
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
        Your Music Mood Analysis
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Mood Metrics */}
        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h4>Happiness Level</h4>
          <div style={{ fontSize: '24px', color: '#1DB954' }}>
            {avgValence.toFixed(1)}%
          </div>
        </div>

        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h4>Energy Level</h4>
          <div style={{ fontSize: '24px', color: '#1DB954' }}>
            {avgEnergy.toFixed(1)}%
          </div>
        </div>

        <div style={{
          backgroundColor: '#1a1a1a',
          padding: '20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h4>Danceability</h4>
          <div style={{ fontSize: '24px', color: '#1DB954' }}>
            {avgDanceability.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Sample of mood-analyzed tracks */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
      }}>
        <h4 style={{ marginBottom: '20px' }}>Your Mood Sample</h4>
        {tracks.slice(0, 5).map(track => (
          <div key={track.id} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#282828',
            borderRadius: '8px'
          }}>
            {track.album.images[0] && (
              <img 
                src={track.album.images[0].url}
                alt={track.name}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '4px'
                }}
              />
            )}
            <div>
              <div style={{ fontWeight: 'bold' }}>{track.name}</div>
              <div style={{ color: '#b3b3b3', fontSize: '14px' }}>{track.artists[0].name}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoodAnalysis;