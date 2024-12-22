// src/hooks/useSpotifyAuth.js
import { useState, useEffect } from "react";

const useSpotifyAuth = () => {
  const [token, setToken] = useState(null);

 // in useSpotifyAuth.js
useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const token = new URLSearchParams(hash.substring(1)).get("access_token");
      if (token) {
        console.log("Token found:", token.substring(0, 5) + "..."); // Debug log
        localStorage.setItem("spotifyToken", token); // Make sure this line exists
        setToken(token);
        window.location.hash = "";
      }
    }
  }, []);

  return token;
};

export default useSpotifyAuth;
