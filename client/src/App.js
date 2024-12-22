import React, { useEffect } from "react";
import { setAccessToken, getUserProfile } from "./services/SpotifyApi";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import { loginUrl } from "./services/SpotifyAuth"; // Adjust the path if necessary


function App() {
  const token = useSpotifyAuth();

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      getUserProfile().then((user) => console.log("User Data:", user));
    }
  }, [token]);

  return (
    <div className="App">
      {!token ? (
        <a href={loginUrl}>
          <button>Login with Spotify</button>
        </a>
      ) : (
        <h1>Welcome! You are logged in.</h1>
      )}
    </div>
  );
}

export default App;
