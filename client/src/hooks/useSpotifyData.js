import { useState, useEffect } from 'react';
import * as SpotifyApi from '../services/SpotifyApi';

export const useSpotifyData = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const recentTracks = await SpotifyApi.getRecentlyPlayed();
        console.log("Recent tracks data:", recentTracks);
        setRecentlyPlayed(recentTracks);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { recentlyPlayed, loading, error };
};