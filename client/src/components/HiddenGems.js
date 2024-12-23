import React, { useEffect, useState } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const HiddenGems = () => {
  const [hiddenGems, setHiddenGems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findHiddenGems = async () => {
      try {
        // Get user's top tracks
        const topTracks = await SpotifyApi.getPersonalTopTracks();
        console.log("Fetched top tracks:", topTracks);

        // Process tracks in batches to avoid rate limiting
        const batchSize = 5;
        const gems = [];
        
        for (let i = 0; i < Math.min(topTracks.items.length, 20); i += batchSize) {
          const batch = topTracks.items.slice(i, i + batchSize);
          
          // Add delay between batches
          if (i > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }

          const batchResults = await Promise.all(
            batch.map(async (track) => {
              try {
                const artistInfo = await SpotifyApi.getArtistDetails(track.artists[0].id);
                return {
                  ...track,
                  artistFollowers: artistInfo.followers.total,
                  artistPopularity: artistInfo.popularity
                };
              } catch (error) {
                console.error(`Error fetching artist details for ${track.artists[0].name}:`, error);
                return null;
              }
            })
          );

          gems.push(...batchResults.filter(Boolean));
        }

        // Filter and sort the results
        const finalGems = gems
          .filter(track => track && track.artistFollowers < 500000)
          .sort((a, b) => b.popularity - a.popularity)
          .slice(0, 5);

        console.log("Found hidden gems:", finalGems);
        setHiddenGems(finalGems);
        setLoading(false);
      } catch (error) {
        console.error("Error finding hidden gems:", error);
        setLoading(false);
      }
    };

    findHiddenGems();
  }, []);

  if (loading) {
    return <div className="section-content">Discovering your hidden gems...</div>;
  }

  return (
    <div className="section-content" style={{ 
      backgroundColor: '#282828',
      padding: '30px',
      borderRadius: '12px',
      color: 'white'
    }}>
      <h3 style={{ 
        fontSize: '24px', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        Your Hidden Gems
      </h3>

      <div style={{ marginBottom: '20px', textAlign: 'center', color: '#b3b3b3' }}>
        These are your favorite tracks from up-and-coming artists
      </div>

      {hiddenGems.map((track, index) => (
        <div
          key={track.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            backgroundColor: '#1a1a1a',
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '12px',
          }}
        >
          {track.album.images[0] && (
            <img
              src={track.album.images[0].url}
              alt={track.name}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '4px'
              }}
            />
          )}
          
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', marginBottom: '4px' }}>{track.name}</div>
            <div style={{ color: '#b3b3b3', fontSize: '14px' }}>
              {track.artists[0].name}
            </div>
            <div style={{ 
              color: '#1DB954', 
              fontSize: '12px',
              marginTop: '8px' 
            }}>
              Artist Followers: {track.artistFollowers.toLocaleString()}
            </div>
          </div>
        </div>
      ))}

      <div style={{ 
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ color: '#1DB954', marginBottom: '10px' }}>💎 Did you know?</div>
        <div style={{ color: '#b3b3b3', fontSize: '14px' }}>
          You're among the top listeners for these artists on Spotify!
        </div>
      </div>
    </div>
  );
};

export default HiddenGems;