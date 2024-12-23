import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const setAccessToken = (token) => {
  console.log("Setting access token:", token ? "Token exists" : "No token");
  if (token) {
    spotifyApi.setAccessToken(token);
    localStorage.setItem("spotifyToken", token); // Save token to localStorage
  }
};

export const getRecentlyPlayed = async (limit = 50) => {
  const token = localStorage.getItem("spotifyToken");
  console.log("Getting recently played with token:", token ? "Token exists" : "No token");

  if (!token) {
    throw new Error("No access token available");
  }

  spotifyApi.setAccessToken(token); // Ensure token is set before request
  return spotifyApi.getMyRecentlyPlayedTracks({ limit });
};

export const getUserProfile = async () => {
  const token = localStorage.getItem("spotifyToken");
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMe();
};

export const getTopTracks = async (timeRange = "short_term", limit = 50) => {
  const token = localStorage.getItem("spotifyToken");
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getMyTopTracks({ time_range: timeRange, limit });
};

export const getTopArtists = async (timeRange = "long_term", limit = 50) => {
  const token = localStorage.getItem("spotifyToken");
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
  const token = localStorage.getItem("spotifyToken");
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  return spotifyApi.getAudioFeaturesForTracks(trackIds);
};

export const getRecentlyPlayedHistory = async () => {
  const token = localStorage.getItem("spotifyToken");
  if (!token) {
    throw new Error("No access token");
  }
  spotifyApi.setAccessToken(token);
  // Get maximum allowed historical data
  return spotifyApi.getMyRecentlyPlayedTracks({ limit: 50, before: Date.now() });
};

export const getArtistHistory = async (artistId) => {
  const token = localStorage.getItem("spotifyToken");
  if (!token) {
    throw new Error("No access token");
  }
  spotifyApi.setAccessToken(token);
  return spotifyApi.getArtistTopTracks(artistId, "US");
};

export const getPersonalTopTracks = async () => {
  const token = localStorage.getItem("spotifyToken");
  if (!token) {
    throw new Error("No access token");
  }
  spotifyApi.setAccessToken(token);
  // Get more tracks to ensure we have enough data per artist
  return spotifyApi.getMyTopTracks({ limit: 50, time_range: "long_term" });
};

export const getTracksWithAudioFeatures = async () => {
  const token = localStorage.getItem("spotifyToken");
  if (!token) {
    throw new Error("No access token");
  }

  try {
    spotifyApi.setAccessToken(token);

    console.log("Starting to fetch top tracks...");
    const topTracks = await spotifyApi.getMyTopTracks({
      limit: 20, // Reduced limit for testing
      time_range: "long_term",
    });
    console.log("Successfully fetched top tracks:", topTracks);

    const trackIds = topTracks.items.map((track) => track.id);
    console.log("Track IDs:", trackIds);

    const features = await spotifyApi.getAudioFeaturesForTracks(trackIds);
    console.log("Audio features:", features);

    return topTracks.items.map((track, index) => ({
      ...track,
      audioFeatures: features.audio_features?.[index] || null,
    }));
  } catch (error) {
    console.error("Detailed error:", error.response || error);
    throw error;
  }
};
export const getYearlyTopTracks = async (limit = 50) => {
  const token = localStorage.getItem("spotifyToken");
  if (token) {
    spotifyApi.setAccessToken(token);
  }
  console.log("Fetching top tracks for the year (long_term)");
  try {
    return await spotifyApi.getMyTopTracks({ time_range: "long_term", limit });
  } catch (error) {
    console.error("Error fetching yearly top tracks:", error.message);
    throw error;
  }
};
export const getArtistDetails = async (artistId) => {
  const token = localStorage.getItem('spotifyToken');
  if (!token) {
    throw new Error("No access token");
  }
  spotifyApi.setAccessToken(token);
  return spotifyApi.getArtist(artistId);
};