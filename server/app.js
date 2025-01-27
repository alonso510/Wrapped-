const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const spotifyRoutes = require("./routes/spotify");

// Load environment variables before using them
dotenv.config();

// Verify environment variables are loaded
console.log('Checking environment variables:');
console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID ? 'Found' : 'Missing');
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Found' : 'Missing');
console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI ? 'Found' : 'Missing');

const app = express();

// Configure CORS based on environment
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || 'https://wrappedplus-3b79de03b658.herokuapp.com'
    : 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));

// API routes
app.use("/api/spotify", spotifyRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React build
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Callback URL: ${process.env.SPOTIFY_REDIRECT_URI}`);
});