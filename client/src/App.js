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
  const { recentlyPlayed, topArtists, loading } = useSpotifyData();

  useEffect(() => {
    if (token) {
      setAccessToken(token);
      getUserProfile().then((userData) => {
        setUser(userData);
      });
    }
  }, [token]);

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

  // Login Page
  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#121212",
        }}
      >
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            borderRadius: "8px",
            backgroundColor: "#282828",
          }}
        >
          <h1
            style={{
              color: "#1DB954",
              marginBottom: "20px",
              fontSize: "2em",
            }}
          >
            Welcome to Wrapped+
          </h1>
          <p style={{ color: "#b3b3b3", marginBottom: "30px" }}>
            Log in to explore your personalized music journey.
          </p>
          <a href={loginUrl}>
            <button
              style={{
                backgroundColor: "#1DB954",
                color: "#ffffff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "50px",
                fontSize: "1em",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Login with Spotify
            </button>
          </a>
        </div>
      </div>
    );
  }

  // Loading Page
  if (loading) {
    return (
      <div className="App">
        <NavBar user={user} />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            color: "white",
            fontSize: "1.5rem",
          }}
        >
          Loading your music data...
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <NavBar user={user} />
      <div className="sections-container">
        {/* Welcome Section */}
        <section
          className="section section-1"
          ref={(el) => (sectionsRef.current[0] = el)}
        >
          <div
            className="section-content"
            style={{
              backgroundColor: "#121212",
              color: "white",
              textAlign: "center",
              padding: "40px 20px",
              borderRadius: "8px",
            }}
          >
            <h1
              style={{
                fontSize: "2.5em",
                marginBottom: "20px",
                color: "#1DB954",
              }}
            >
              Welcome to Wrapped+
            </h1>
            <p
              style={{
                fontSize: "1em",
                color: "#b3b3b3",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Scroll down to explore your music journey and discover the tracks,
              artists, and genres that made your year special.
            </p>
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
