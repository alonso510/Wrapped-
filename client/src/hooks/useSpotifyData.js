import { useState, useEffect } from 'react';
import * as SpotifyApi from '../services/SpotifyApi';

export const useSpotifyData = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState(null);
  const [topArtists, setTopArtists] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("Starting to fetch data...");

        // Get recently played tracks
        const recentTracks = await SpotifyApi.getRecentlyPlayed();
        console.log("Got recent tracks:", recentTracks);
        setRecentlyPlayed(recentTracks);

        // Get top artists - with explicit error handling
        try {
          console.log("Attempting to fetch top artists...");
          const artistsData = await SpotifyApi.getTopArtists();
          console.log("Successfully got top artists:", artistsData);
          setTopArtists(artistsData);
        } catch (artistError) {
          console.error("Error fetching top artists:", artistError);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error in data fetching:', err);
        setError(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { recentlyPlayed, topArtists, loading, error };
};