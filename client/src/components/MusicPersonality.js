import React, { useEffect, useState } from "react";
import * as SpotifyApi from "../services/SpotifyApi";

const PERSONALITY_TYPES = {
 "The Sonic Explorer": {
   description: "A musical adventurer constantly seeking new sounds and genres",
   traits: ["Diverse playlists", "High artist variety", "Genre-fluid"],
   icon: "🌎"
 },
 "The Genre Specialist": {
   description: "Deep expertise and appreciation for specific genres",
   traits: ["Genre loyal", "Artist encyclopedic knowledge", "Niche appreciation"],
   icon: "🎯"
 },
 "The Mood Maestro": {
   description: "Expert at matching music to emotions and moments",
   traits: ["Emotional connection", "Context-aware", "Playlist curator"],
   icon: "🎭"
 },
 "The Trend Surfer": {
   description: "Always in tune with the latest hits and emerging artists",
   traits: ["Early adopter", "High playlist turnover", "Social listener"],
   icon: "🌊"
 },
 "The Classic Connoisseur": {
   description: "Appreciates timeless music with deep artist loyalty",
   traits: ["Long-term listener", "Complete albums", "Artist loyal"],
   icon: "🎵"
 }
};

const MusicPersonality = () => {
 const [personality, setPersonality] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
    const analyze = async () => {
      await analyzeDetailedPersonality();
    };
    analyze();
  }, []); // Add eslint exception here
  // eslint-disable-next-line react-hooks/exhaustive-deps
 const analyzeDetailedPersonality = async () => {
   try {
     const [topTracks, topArtists, recentTracks] = await Promise.all([
       SpotifyApi.getTopTracks('long_term', 50),
       SpotifyApi.getTopArtists('long_term', 50),
       SpotifyApi.getRecentlyPlayed(50)
     ]);

     // Advanced Analysis
     const analysis = {
       genreVariety: calculateGenreVariety(topArtists),
       artistLoyalty: calculateArtistLoyalty(topTracks),
       trendAlignment: calculateTrendAlignment(topArtists),
       listeningPatterns: analyzeListeningPatterns(recentTracks),
       musicEra: analyzeEra(topTracks)
     };

     const types = determinePersonalityTypes(analysis);
     
     setPersonality({
       primaryType: types.primary,
       secondaryType: types.secondary,
       traits: analysis,
       insights: generateInsights(analysis, types)
     });
     setLoading(false);
   } catch (error) {
     console.error("Analysis error:", error);
     setLoading(false);
   }
 };

 const calculateGenreVariety = (artists) => {
   const genres = new Set(artists.items.flatMap(artist => artist.genres));
   return genres.size / artists.items.length;
 };

 const calculateArtistLoyalty = (tracks) => {
   const artistCounts = tracks.items.reduce((acc, track) => {
     const artistId = track.artists[0].id;
     acc[artistId] = (acc[artistId] || 0) + 1;
     return acc;
   }, {});
   return Math.max(...Object.values(artistCounts)) / tracks.items.length;
 };

 const calculateTrendAlignment = (artists) => {
   const averagePopularity = artists.items.reduce((sum, artist) => sum + artist.popularity, 0) / artists.items.length;
   return averagePopularity / 100;
 };

 const analyzeListeningPatterns = (recentTracks) => {
   const hours = recentTracks.items.map(track => new Date(track.played_at).getHours());
   const mostCommonHour = hours.reduce((acc, hour) => {
     acc[hour] = (acc[hour] || 0) + 1;
     return acc;
   }, {});
   return Object.entries(mostCommonHour).sort((a, b) => b[1] - a[1])[0][0];
 };

 const analyzeEra = (tracks) => {
   const years = tracks.items.map(track => new Date(track.album.release_date).getFullYear());
   const averageYear = years.reduce((sum, year) => sum + year, 0) / years.length;
   return averageYear >= 2020 ? "Contemporary" : averageYear >= 2010 ? "Modern" : "Classic";
 };

 const determinePersonalityTypes = (analysis) => {
   const scores = {
     "The Sonic Explorer": analysis.genreVariety * 0.8 + (1 - analysis.artistLoyalty) * 0.2,
     "The Genre Specialist": (1 - analysis.genreVariety) * 0.7 + analysis.artistLoyalty * 0.3,
     "The Mood Maestro": analysis.genreVariety * 0.4 + analysis.trendAlignment * 0.6,
     "The Trend Surfer": analysis.trendAlignment * 0.8 + (1 - analysis.artistLoyalty) * 0.2,
     "The Classic Connoisseur": analysis.artistLoyalty * 0.7 + (1 - analysis.trendAlignment) * 0.3
   };

   const sortedTypes = Object.entries(scores).sort((a, b) => b[1] - a[1]);
   return {
     primary: sortedTypes[0][0],
     secondary: sortedTypes[1][0]
   };
 };

 const generateInsights = (analysis, types) => {
   const insights = [];
   
   if (analysis.genreVariety > 0.7) {
     insights.push("You have an exceptionally diverse taste in music");
   }
   if (analysis.artistLoyalty > 0.6) {
     insights.push("You form strong connections with your favorite artists");
   }
   if (analysis.trendAlignment > 0.8) {
     insights.push("You're always on top of the latest music trends");
   }
   
   insights.push(`Peak listening time: ${analysis.listeningPatterns}:00`);
   insights.push(`You gravitate towards ${analysis.musicEra.toLowerCase()} music`);

   return insights;
 };

 if (loading) {
   return <div className="section-content">Analyzing your music personality...</div>;
 }

 return (
   <div className="section-content" style={{
     backgroundColor: '#282828',
     padding: '30px',
     borderRadius: '12px',
     color: 'white'
   }}>
     <h3 style={{
       textAlign: 'center',
       marginBottom: '30px',
       fontSize: '24px'
     }}>
       {personality.primaryType} {PERSONALITY_TYPES[personality.primaryType].icon}
     </h3>

     {/* Primary Type Card */}
     <div style={{
       backgroundColor: '#1a1a1a',
       padding: '20px',
       borderRadius: '12px',
       marginBottom: '20px'
     }}>
       <h4 style={{color: '#1DB954'}}>Primary Music Personality</h4>
       <p>{PERSONALITY_TYPES[personality.primaryType].description}</p>
       <div style={{
         display: 'flex',
         flexWrap: 'wrap',
         gap: '10px',
         marginTop: '10px'
       }}>
         {PERSONALITY_TYPES[personality.primaryType].traits.map(trait => (
           <span key={trait} style={{
             backgroundColor: '#1DB954',
             padding: '4px 12px',
             borderRadius: '12px',
             fontSize: '12px'
           }}>
             {trait}
           </span>
         ))}
       </div>
     </div>

     {/* Stats Grid */}
     <div style={{
       display: 'grid',
       gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
       gap: '20px',
       marginBottom: '20px'
     }}>
       <StatCard 
         title="Genre Variety"
         value={`${(personality.traits.genreVariety * 100).toFixed(0)}%`}
       />
       <StatCard 
         title="Artist Loyalty"
         value={`${(personality.traits.artistLoyalty * 100).toFixed(0)}%`}
       />
       <StatCard 
         title="Trend Alignment"
         value={`${(personality.traits.trendAlignment * 100).toFixed(0)}%`}
       />
     </div>

     {/* Secondary Type */}
     <div style={{
       backgroundColor: '#1a1a1a',
       padding: '20px',
       borderRadius: '12px',
       marginBottom: '20px'
     }}>
       <h4 style={{color: '#1DB954'}}>Secondary Trait</h4>
       <p>You also show characteristics of: {personality.secondaryType} {PERSONALITY_TYPES[personality.secondaryType].icon}</p>
     </div>

     {/* Insights Section */}
     <div style={{
       backgroundColor: '#1a1a1a',
       padding: '20px',
       borderRadius: '12px'
     }}>
       <h4 style={{color: '#1DB954', marginBottom: '15px'}}>Your Music Story</h4>
       <ul style={{listStyle: 'none', padding: 0}}>
         {personality.insights.map((insight, index) => (
           <li key={index} style={{marginBottom: '10px'}}>
             • {insight}
           </li>
         ))}
       </ul>
     </div>
   </div>
 );
};

const StatCard = ({ title, value }) => (
 <div style={{
   backgroundColor: '#1a1a1a',
   padding: '15px',
   borderRadius: '8px',
   textAlign: 'center'
 }}>
   <div style={{color: '#b3b3b3', fontSize: '14px'}}>{title}</div>
   <div style={{color: '#1DB954', fontSize: '24px', fontWeight: 'bold'}}>{value}</div>
 </div>
);

export default MusicPersonality;