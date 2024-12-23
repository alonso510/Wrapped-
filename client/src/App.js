import React, { useEffect, useState, useRef } from "react";
import { setAccessToken, getUserProfile } from "./services/SpotifyApi";
import useSpotifyAuth from "./hooks/useSpotifyAuth";
import { loginUrl } from "./services/SpotifyAuth";
import NavBar from "./components/NavBar";
import "./App.css";
import { useSpotifyData } from "./hooks/useSpotifyData";
import ListeningTimeAnalysis from "./components/ListeningTimeAnalysis";
import GenreDiversity from "./components/GenreDiversity";
import ArtistTimeline from "./components/ArtistTimeline";

function App() {
  const token = useSpotifyAuth();
  const [user, setUser] = useState(null);
  const sectionsRef = useRef([]);
  const {
    recentlyPlayed,
    topTracks,
    topArtists,
    audioFeatures,
    loading,
    error,
  } = useSpotifyData();

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      getUserProfile().then((userData) => {
        console.log("User Data:", userData);
        setUser(userData);
      });
    }
  }, [token]);

  // Handle scroll animations
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target
            .querySelector(".section-content")
            .classList.add("visible");
        }
      });
    }, observerOptions);

    sectionsRef.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // First check for token
  if (!token) {
    return (
      <div className="App">
        <a href={loginUrl}>
          <button>Login with Spotify</button>
        </a>
      </div>
    );
  }

  // Then check loading state
  if (loading) {
    return (
      <div className="App">
        <NavBar user={user} />
        <div className="loading">Loading your music data...</div>
      </div>
    );
  }
  console.log("App Data:", {
    recentlyPlayed,
    topTracks,
    topArtists,
    audioFeatures,
  });
  console.log("App render - recentlyPlayed data:", recentlyPlayed);
  // Main content render
  return (
    <div className="App">
      <NavBar user={user} />
      <div className="sections-container">
        <section
          className="section section-1"
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          <div className="section-content">
            <h1>Welcome to Your Wrapped+</h1>
            <p>Scroll to explore your music journey</p>
          </div>
        </section>

        <section
          className="section section-2"
          ref={(el) => (sectionsRef.current[1] = el)}
        >
          <div className="section-content">
            <h2>Listening Time</h2>
            <div className="analytics-grid">
              {recentlyPlayed &&
                console.log("Recent Played Data available:", recentlyPlayed)}
              <ListeningTimeAnalysis recentlyPlayed={recentlyPlayed} />
            </div>
          </div>
        </section>

        <section
          className="section section-3"
          ref={(el) => (sectionsRef.current[2] = el)}
        >
          <div className="section-content">
            <h2>Genre Diversity</h2>
            {console.log(
              "Rendering GenreDiversity with topArtists:",
              topArtists
            )}
            <GenreDiversity topArtists={topArtists} />
          </div>
        </section>
        <section
          className="section section-4"
          ref={(el) => (sectionsRef.current[3] = el)}
        >
          <div className="section-content">
            <ArtistTimeline topArtists={topArtists} />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
