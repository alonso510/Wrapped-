const express = require("express");
const axios = require("axios");
const router = express.Router();
const dotenv = require('dotenv');

// Ensure environment variables are loaded
dotenv.config();

// Log environment variables on startup (remove in production)
console.log('Environment variables check:');
console.log('SPOTIFY_CLIENT_ID:', process.env.SPOTIFY_CLIENT_ID ? 'Present' : 'Missing');
console.log('SPOTIFY_CLIENT_SECRET:', process.env.SPOTIFY_CLIENT_SECRET ? 'Present' : 'Missing');
console.log('SPOTIFY_REDIRECT_URI:', process.env.SPOTIFY_REDIRECT_URI ? 'Present' : 'Missing');

// Step 1: Redirect user to Spotify login
router.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "streaming"
  ];

  // Construct the auth URL with proper environment variables
  const authUrl = `https://accounts.spotify.com/authorize?` + 
    `client_id=${process.env.SPOTIFY_CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(process.env.SPOTIFY_REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(scopes.join(" "))}`;

  // Log the constructed URL (remove in production)
  console.log('Redirecting to:', authUrl);
  
  res.redirect(authUrl);
});

// Step 2: Handle the callback from Spotify
router.get("/callback", async (req, res) => {
  const code = req.query.code;

  try {
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

    // After successful token exchange, redirect to frontend with token
    const redirectUrl = `http://localhost:3000/#access_token=${response.data.access_token}`;
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error("Error exchanging code for tokens:", error.response?.data || error.message);
    res.status(500).send("Authentication failed.");
  }
});

module.exports = router;