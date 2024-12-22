// src/hooks/useSpotifyAuth.js
import { useState, useEffect } from "react";

const useSpotifyAuth = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
      token = new URLSearchParams(hash.substring(1)).get("access_token");
      window.location.hash = ""; // Clear the hash
      if (token) {
        setToken(token);
        localStorage.setItem("spotifyToken", token); // Optional: store token
      }
    }
  }, []);

  return token;
};

export default useSpotifyAuth;
