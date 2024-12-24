import React, { useEffect, useState, useCallback } from "react";
import * as SpotifyApi from "../services/SpotifyApi";
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

const ListeningComparison = () => {
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);

  const analyzeDemographics = useCallback(async () => {
    try {
      const [userTracks, userArtists] = await Promise.all([
        SpotifyApi.getTopTracks('long_term', 50),
        SpotifyApi.getTopArtists('long_term', 50)
      ]);

      const userMetrics = calculateUserMetrics(userTracks, userArtists);
      const comparisonResults = compareWithDemographics(userMetrics);
      setComparisonData(comparisonResults);
      setLoading(false);
    } catch (error) {
      console.error("Demographics analysis error:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    analyzeDemographics();
  }, [analyzeDemographics]);

  const calculateUserMetrics = (tracks, artists) => {
    if (!tracks?.items?.length || !artists?.items?.length) return null;

    const popularityScores = tracks.items.map(track => track.popularity);
    const genreSet = new Set(artists.items.flatMap(artist => artist.genres));
    const releaseYears = tracks.items.map(track => new Date(track.album.release_date).getFullYear());
    const avgYear = releaseYears.reduce((a, b) => a + b) / releaseYears.length;

    return {
      avgPopularity: popularityScores.reduce((a, b) => a + b) / popularityScores.length,
      genreDiversity: genreSet.size,
      eraPreference: avgYear,
      mainstreamAlignment: popularityScores.filter(score => score > 75).length / popularityScores.length,
      artistVariety: new Set(tracks.items.map(track => track.artists[0].id)).size
    };
  };

  const compareWithDemographics = (userMetrics) => {
    if (!userMetrics) return null;

    const demographicRanges = {
      "Gen Z": {
        avgPopularity: 85,
        genreDiversity: 8,
        eraPreference: 2020,
        mainstreamAlignment: 0.8,
        artistVariety: 35
      },
      "Millennials": {
        avgPopularity: 75,
        genreDiversity: 12,
        eraPreference: 2010,
        mainstreamAlignment: 0.6,
        artistVariety: 45
      },
      "Gen X": {
        avgPopularity: 65,
        genreDiversity: 10,
        eraPreference: 1995,
        mainstreamAlignment: 0.4,
        artistVariety: 40
      }
    };

    const similarities = Object.entries(demographicRanges).map(([demo, metrics]) => {
      const score = calculateSimilarityScore(userMetrics, metrics);
      return { demographic: demo, similarity: score };
    });

    const closestDemographic = similarities.reduce((a, b) => 
      a.similarity > b.similarity ? a : b
    );

    return {
      userMetrics,
      demographicRanges,
      closestMatch: closestDemographic.demographic,
      similarityScore: closestDemographic.similarity,
      radarData: prepareRadarData(userMetrics, demographicRanges, closestDemographic.demographic)
    };
  };

  const calculateSimilarityScore = (user, demographic) => {
    const weights = {
      avgPopularity: 0.2,
      genreDiversity: 0.2,
      eraPreference: 0.3,
      mainstreamAlignment: 0.15,
      artistVariety: 0.15
    };

    return Object.keys(weights).reduce((score, metric) => {
      const normalizedDiff = Math.abs(user[metric] - demographic[metric]) / demographic[metric];
      return score - (normalizedDiff * weights[metric]);
    }, 1);
  };

  const prepareRadarData = (user, demographics, closestMatch) => {
    if (!user || !demographics || !closestMatch) return [];

    return Object.keys(user).map(metric => ({
      metric: metric.replace(/([A-Z])/g, ' $1').trim(),
      user: normalizeMetric(user[metric], metric),
      demographic: normalizeMetric(demographics[closestMatch][metric], metric)
    }));
  };

  const normalizeMetric = (value, metric) => {
    const ranges = {
      avgPopularity: [0, 100],
      genreDiversity: [0, 20],
      eraPreference: [1960, 2024],
      mainstreamAlignment: [0, 1],
      artistVariety: [0, 50]
    };

    const [min, max] = ranges[metric];
    return ((value - min) / (max - min)) * 100;
  };

  if (loading || !comparisonData) {
    return <div className="section-content">Analyzing demographic patterns...</div>;
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
        Your Music in Context
      </h3>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h4 style={{color: '#1DB954', marginBottom: '10px'}}>
          Your Listening Profile Most Closely Matches
        </h4>
        <div style={{fontSize: '24px', marginBottom: '10px'}}>
          {comparisonData.closestMatch}
        </div>
        <div style={{color: '#b3b3b3'}}>
          {(comparisonData.similarityScore * 100).toFixed(1)}% similarity
        </div>
      </div>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        height: '400px'
      }}>
        <ResponsiveContainer>
          <RadarChart data={comparisonData.radarData}>
            <PolarGrid stroke="#444" />
            <PolarAngleAxis dataKey="metric" stroke="#fff" />
            <Radar
              name="Your Profile"
              dataKey="user"
              stroke="#1DB954"
              fill="#1DB954"
              fillOpacity={0.3}
            />
            <Radar
              name="Demographic Average"
              dataKey="demographic"
              stroke="#b3b3b3"
              fill="#b3b3b3"
              fillOpacity={0.3}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '12px',
        marginTop: '20px'
      }}>
        <h4 style={{color: '#1DB954', marginBottom: '15px'}}>What Makes You Unique</h4>
        <ul style={{listStyle: 'none', padding: 0}}>
          {generateUniqueTraits(comparisonData.userMetrics, 
                              comparisonData.demographicRanges[comparisonData.closestMatch])
            .map((trait, index) => (
              <li key={index} style={{marginBottom: '10px'}}>• {trait}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const generateUniqueTraits = (user, demographic) => {
  if (!user || !demographic) return [];
  
  const traits = [];
  
  if (user.avgPopularity > demographic.avgPopularity + 10) {
    traits.push("You tend to discover trending music earlier than others");
  } else if (user.avgPopularity < demographic.avgPopularity - 10) {
    traits.push("You have a strong appreciation for underground music");
  }

  if (user.genreDiversity > demographic.genreDiversity + 2) {
    traits.push("Your taste in music is more diverse than average");
  }

  if (Math.abs(user.eraPreference - demographic.eraPreference) > 10) {
    traits.push(user.eraPreference > demographic.eraPreference ? 
      "You're more drawn to contemporary music" :
      "You have a stronger connection to classic tracks");
  }

  if (user.artistVariety > demographic.artistVariety + 5) {
    traits.push("You explore more artists than typical listeners");
  }

  return traits;
};

export default ListeningComparison;