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

export const getTopTracks = async (timeRange = 'long_term', limit = 50) => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMyTopTracks({ time_range: timeRange, limit });
};

export const getTopArtists = async (timeRange = 'long_term', limit = 50) => {
  const token = localStorage.getItem('spotifyToken');
  console.log("Token for top artists:", token ? "exists" : "missing");
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  console.log("About to call getMyTopArtists with params:", { timeRange, limit });
  const result = await spotifyApi.getMyTopArtists({ time_range: timeRange, limit });
  console.log("getTopArtists result:", result);
  return result;
};

export const getAudioFeatures = async (trackIds) => {
  const token = localStorage.getItem('spotifyToken');
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getAudioFeaturesForTracks(trackIds);
};