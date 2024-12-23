import React, { useEffect, useState } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const SongRepetitionPatterns = () => {
  const [yearlyTopTracks, setYearlyTopTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false); // Track whether the list is expanded

  useEffect(() => {
    const fetchYearlyTracks = async () => {
      try {
        const data = await SpotifyApi.getYearlyTopTracks(50);

        // Simulate play counts (replace with actual data if available)
        const tracksWithPlays = data.items.map((track) => ({
          ...track,
          playCount: Math.floor(Math.random() * 100) + 50, // Simulated play count
        }));

        setYearlyTopTracks(tracksWithPlays);
      } catch (error) {
        console.error("Error fetching yearly tracks:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchYearlyTracks();
  }, []);

  const visibleTracks = expanded ? yearlyTopTracks : yearlyTopTracks.slice(0, 10); // Show all or top 10

  if (loading) {
    return (
      <div style={{ color: "#b3b3b3", textAlign: "center" }}>
        Loading your most played songs of the year...
      </div>
    );
  }

  if (!yearlyTopTracks.length) {
    return (
      <div style={{ color: "#b3b3b3", textAlign: "center" }}>
        No data available for your yearly top tracks.
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "#282828",
        padding: "30px",
        borderRadius: "12px",
        color: "white",
      }}
    >
      <h3
        style={{
          fontSize: "24px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Your Top Songs of the Year
      </h3>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {visibleTracks.map((track, index) => (
          <li
            key={track.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
              marginBottom: "15px",
              backgroundColor: "#1a1a1a",
              padding: "15px",
              borderRadius: "8px",
            }}
          >
            {/* Album Art */}
            {track.album.images[0] && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "4px",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            )}

            {/* Track Info */}
            <div style={{ flex: 1 }}>
              {/* Track Name */}
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "16px",
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
              >
                #{index + 1} {track.name}
              </div>

              {/* Artists */}
              <div
                style={{
                  color: "#b3b3b3",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>

              {/* Play Count */}
              <div
                style={{
                  color: "#1DB954",
                  fontSize: "14px",
                  marginTop: "4px",
                }}
              >
                {track.playCount} plays
              </div>
            </div>
          </li>
        ))}
      </ul>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#1DB954",
          border: "none",
          borderRadius: "8px",
          color: "white",
          cursor: "pointer",
        }}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

export default SongRepetitionPatterns;
