const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Enhanced logging
console.log('Environment variables check with full values:');
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID);
console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI);
console.log('Current Environment:', process.env.NODE_ENV);

// Step 1: Redirect user to Spotify login
router.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-read-currently-playing",
    "user-top-read",
    "playlist-read-private",
    "streaming"
  ];

  // Remove duplicate scopes and log the final scope list
  const uniqueScopes = [...new Set(scopes)];
  console.log('Using scopes:', uniqueScopes);

  // Construct and log the exact redirect URI being used
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI;
  console.log('Using redirect URI:', redirectUri);
  
  const authUrl = `https://accounts.spotify.com/authorize?` + 
    `client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(uniqueScopes.join(" "))}`;

  console.log('Full auth URL:', authUrl);
  
  res.redirect(authUrl);
});

// Step 2: Handle the callback from Spotify
router.get("/callback", async (req, res) => {
  console.log('Received callback with code:', req.query.code ? 'Present' : 'Missing');
  const code = req.query.code;

  try {
    console.log('Attempting token exchange with redirect URI:', process.env.SPOTIFY_REDIRECT_URI);
    
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        client_id: process.env.SPOTIFY_CLIENT_ID,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    console.log('Token exchange successful');
    const redirectUrl = `http://localhost:3000/#access_token=${response.data.access_token}`;
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error("Detailed error information:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    res.status(500).send("Authentication failed.");
  }
});

module.exports = router;