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
import SongRepetitionPatterns from "./components/SongRepetitionPatterns";
import HiddenGems from "./components/HiddenGems";
import MusicEvolution from "./components/MusicEvolution";
import MusicPersonality from "./components/MusicPersonality";
import ListeningComparison from "./components/ListeningComparison";

import FestivalLineup from "./components/FestivalLineup";

function App() {
  const token = useSpotifyAuth();
  const [user, setUser] = useState(null);
  const sectionsRef = useRef([]);
  const { recentlyPlayed, topTracks, topArtists, audioFeatures, loading } =
    useSpotifyData();

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
        <section
          className="section section-5"
          ref={(el) => (sectionsRef.current[4] = el)}
        >
          <div className="section-content">
            <SongRepetitionPatterns />
          </div>
        </section>
        <section
          className="section section-6"
          ref={(el) => (sectionsRef.current[5] = el)}
        >
          <div className="section-content">
            <HiddenGems />
          </div>
        </section>
        <section
          className="section section-8"
          ref={(el) => (sectionsRef.current[7] = el)}
        >
          <div className="section-content">
            <MusicEvolution />
          </div>
        </section>
        <section
          className="section section-9"
          ref={(el) => (sectionsRef.current[8] = el)}
        >
          <div className="section-content">
            <MusicPersonality />
          </div>
        </section>
        <section
          className="section section-10"
          ref={(el) => (sectionsRef.current[9] = el)}
        >
          <div className="section-content">
            <ListeningComparison />
          </div>
        </section>
        <section
          className="section section-11"
          ref={(el) => (sectionsRef.current[10] = el)}
        >
          <div className="section-content">
            <FestivalLineup />
          </div>
        </section>
      </div>
    </div>
  );
}

export default App;
