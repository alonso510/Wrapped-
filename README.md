🎵 Spotify Wrapped Plus+

A sophisticated Spotify analytics dashboard that provides deep insights into your music listening habits. Built with React.js and Node.js, this application leverages the Spotify Web API to analyze user listening patterns and presents the data through an engaging, interactive interface.
✨ Features

📊 Advanced Data Visualization
🎨 Genre Diversity Analysis
⏰ Temporal Listening Patterns
🌟 Hidden Gems Discovery
🎭 Music Personality Analysis
🎪 Festival Lineup Generator
📈 Artist Timeline Tracking

🚀 Getting Started
Prerequisites

Node.js (v14 or higher)
npm or yarn
Spotify Developer Account

Installation

Clone the repository

bashCopygit clone https://github.com/yourusername/spotify-wrapped-plus.git

Install dependencies for both client and server

bashCopy# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install

Create a .env file in the server directory with your Spotify credentials

envCopySPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/spotify/callback

Start the development servers

bashCopy# Start the client (in client directory)
npm start

# Start the server (in server directory)
npm start
🛠️ Built With

Frontend:

React.js
Recharts
Tailwind CSS
Framer Motion
Spotify Web API JS


Backend:

Node.js
Express.js
Axios
OAuth 2.0




🔒 Authentication Flow

User initiates login through the application
User is redirected to Spotify login
After successful authentication, Spotify redirects back to the application
Application exchanges authorization code for access token
User data is fetched and analyzed using Spotify Web API

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the project
Create your feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
🙏 Acknowledgments

Spotify Web API
React.js Community
Node.js Community
All the amazing open-source libraries used in this project


<p align="center">
  Made with ❤️ by Alonso
</p>
