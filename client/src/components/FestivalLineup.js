import React, { useEffect, useState, useCallback } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const FestivalLineup = () => {
  const [artists, setArtists] = useState({ headliners: [], mainActs: [], supportingActs: [] });
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");

  const getLineup = useCallback(async () => {
    try {
      setLoading(true);
      
      const userProfile = await SpotifyApi.getUserProfile();
      setUsername(userProfile.display_name);

      const [longTerm, mediumTerm, shortTerm] = await Promise.all([
        SpotifyApi.getTopArtists("long_term", 20),
        SpotifyApi.getTopArtists("medium_term", 20),
        SpotifyApi.getTopArtists("short_term", 20),
      ]);

      const allArtists = [...longTerm.items, ...mediumTerm.items, ...shortTerm.items];
      const uniqueArtists = Array.from(new Set(allArtists.map((a) => a.id)))
        .map((id) => allArtists.find((a) => a.id === id));

      const shuffled = uniqueArtists.sort(() => Math.random() - 0.45);

      setArtists({
        headliners: shuffled.slice(0, 3),
        mainActs: shuffled.slice(3, 9),
        supportingActs: shuffled.slice(9, 21),
      });

      setLoading(false);
    } catch (error) {
      console.error("Error creating festival lineup:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getLineup();
  }, [getLineup]);

  if (loading) {
    return <div className="section-content">Creating your festival lineup...</div>;
  }

  const currentYear = new Date().getFullYear();

  return (
    <div
      className="section-content"
      style={{
        backgroundColor: "#000",
        padding: "20px",
        color: "white",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundImage: "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.7))",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "20px",
          border: "2px solid #1DB954",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3em",
            marginBottom: "15px",
            color: "#1DB954",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}
        >
          {username}'s FEST {currentYear}
        </h1>
        
        <p
          style={{
            marginBottom: "30px",
            color: "#b3b3b3",
            fontSize: "1.2em",
            textTransform: "uppercase",
          }}
        >
          Presented by Wrapped+
        </p>

        {/* Headliners */}
        <div style={{ marginBottom: "30px" }}>
          {artists.headliners.map((artist) => (
            <div
              key={artist.id}
              style={{
                fontSize: "2em",
                fontWeight: "bold",
                marginBottom: "10px",
                color: "#fff",
                textTransform: "uppercase",
                wordWrap: "break-word",
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>

        {/* Main Acts */}
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {artists.mainActs.map((artist) => (
            <div
              key={artist.id}
              style={{
                fontSize: "1.5em",
                color: "#1DB954",
                wordWrap: "break-word",
                textAlign: "center",
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>

        {/* Supporting Acts */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          {artists.supportingActs.map((artist) => (
            <div
              key={artist.id}
              style={{
                fontSize: "1em",
                color: "#b3b3b3",
                wordWrap: "break-word",
                textAlign: "center",
              }}
            >
              {artist.name}
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: "30px",
            fontSize: "1em",
            color: "#1DB954",
            letterSpacing: "1px",
          }}
        >
          December {currentYear} • Your Music Universe
        </p>
      </div>
    </div>
  );
};

export default FestivalLineup;
