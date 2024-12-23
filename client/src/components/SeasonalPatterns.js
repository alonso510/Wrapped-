import React, { useEffect, useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as SpotifyApi from "../services/SpotifyApi";

const SeasonalPatterns = () => {
  const [seasonalData, setSeasonalData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const analyzeSeasonalPatterns = async () => {
      try {
        const recentTracks = await SpotifyApi.getRecentlyPlayed(50);
        console.log("Fetched recent tracks:", recentTracks);

        // Group tracks by month/season
        const monthlyData = Array.from({ length: 12 }, (_, i) => ({
          month: new Date(2024, i).toLocaleString('default', { month: 'long' }),
          count: 0,
          tracks: [],
          topGenres: new Set(),
        }));

        recentTracks.items.forEach(item => {
          const date = new Date(item.played_at);
          const monthIndex = date.getMonth();
          monthlyData[monthIndex].count++;
          monthlyData[monthIndex].tracks.push(item.track);
          
          // Add genres if available
          item.track.artists.forEach(artist => {
            if (artist.genres) {
              artist.genres.forEach(genre => {
                monthlyData[monthIndex].topGenres.add(genre);
              });
            }
          });
        });

        console.log("Processed seasonal data:", monthlyData);
        setSeasonalData(monthlyData);
        setLoading(false);
      } catch (error) {
        console.error("Error analyzing seasonal patterns:", error);
        setLoading(false);
      }
    };

    analyzeSeasonalPatterns();
  }, []);

  if (loading) {
    return <div className="section-content">Analyzing your seasonal patterns...</div>;
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
        Your Seasonal Listening Patterns
      </h3>

      {/* Monthly listening chart */}
      <div style={{ 
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h4 style={{ marginBottom: '20px' }}>Listening Activity Throughout the Year</h4>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer>
            <LineChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="month" 
                stroke="#fff"
                interval={0}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis stroke="#fff" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#282828',
                  border: '1px solid #1DB954',
                  borderRadius: '4px',
                  color: '#fff'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#1DB954" 
                strokeWidth={2}
                dot={{ fill: '#1DB954' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Seasonal highlights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        {['Winter', 'Spring', 'Summer', 'Fall'].map((season, index) => {
          const monthsData = seasonalData.slice(index * 3, (index * 3) + 3);
          const totalPlays = monthsData.reduce((sum, month) => sum + month.count, 0);
          
          return (
            <div key={season} style={{
              backgroundColor: '#1a1a1a',
              padding: '20px',
              borderRadius: '12px',
            }}>
              <h4 style={{ color: '#1DB954', marginBottom: '15px' }}>{season}</h4>
              <div style={{ color: '#b3b3b3', fontSize: '14px', marginBottom: '10px' }}>
                {totalPlays} plays
              </div>
              <div style={{ fontSize: '12px' }}>
                Peak listening month: {
                  monthsData.reduce((max, month) => 
                    month.count > max.count ? month : max
                  ).month
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SeasonalPatterns;