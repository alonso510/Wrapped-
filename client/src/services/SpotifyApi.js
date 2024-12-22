import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const setAccessToken = (token) => {
  console.log("Setting access token:", token ? "Token exists" : "No token");
  if (token) {
    spotifyApi.setAccessToken(token);
    localStorage.setItem('spotifyToken', token);  // Save token to localStorage
  }
};

export const getRecentlyPlayed = async (limit = 50) => {
  const token = localStorage.getItem('spotifyToken');
  console.log("Getting recently played with token:", token ? "Token exists" : "No token");
  
  if (!token) {
    throw new Error("No access token available");
  }
  
  spotifyApi.setAccessToken(token); // Ensure token is set before request
  return spotifyApi.getMyRecentlyPlayedTracks({ limit });
};

export const getUserProfile = async () => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMe();
};

export const getTopTracks = async (timeRange = 'medium_term', limit = 50) => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMyTopTracks({ time_range: timeRange, limit });
};

export const getTopArtists = async (timeRange = 'medium_term', limit = 50) => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMyTopArtists({ time_range: timeRange, limit });
};

export const getAudioFeatures = async (trackIds) => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getAudioFeaturesForTracks(trackIds);
};