const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const spotifyRoutes = require("./routes/spotify");

// Load environment variables before using them
dotenv.config();

// Verify environment variables are loaded
console.log('Checking environment variables:');
console.log('Client ID:', process.env.SPOTIFY_CLIENT_ID ? 'Found' : 'Missing');
console.log('Client Secret:', process.env.SPOTIFY_CLIENT_SECRET ? 'Found' : 'Missing');
console.log('Redirect URI:', process.env.SPOTIFY_REDIRECT_URI ? 'Found' : 'Missing');

const app = express();

// Configure CORS for development
app.use(cors({
  origin: 'http://localhost:3000', // React app's address
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use("/api/spotify", spotifyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Callback URL: ${process.env.SPOTIFY_REDIRECT_URI}`);
});