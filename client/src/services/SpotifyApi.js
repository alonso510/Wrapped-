// src/services/SpotifyApi.js
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

export const setAccessToken = (token) => {
  spotifyApi.setAccessToken(token);
};

export const getUserProfile = async () => {
  return spotifyApi.getMe();
};
