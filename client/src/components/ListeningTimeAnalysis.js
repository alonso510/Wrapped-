import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ListeningTimeAnalysis = ({ recentlyPlayed }) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [listenerType, setListenerType] = useState('');

  const getPeakListeningInsight = (hourlyData) => {
    let peakHour = 0;
    let maxPlays = 0;
    let totalPlays = 0;
    
    hourlyData.forEach(data => {
      totalPlays += data.count;
      if (data.count > maxPlays) {
        maxPlays = data.count;
        peakHour = data.hour;
      }
    });

    const peakTimeFormatted = `${peakHour === 0 ? '12 AM' : 
      peakHour < 12 ? `${peakHour} AM` : 
      peakHour === 12 ? '12 PM' : 
      `${peakHour-12} PM`}`;

    return {
      peakTime: peakTimeFormatted,
      totalPlays,
      peakPlays: maxPlays
    };
  };

  const getListenerType = (hourlyData) => {
    let peakHour = 0;
    let maxPlays = 0;
    
    hourlyData.forEach(data => {
      if (data.count > maxPlays) {
        maxPlays = data.count;
        peakHour = data.hour;
      }
    });

    if (peakHour >= 0 && peakHour < 6) {
      return "Night Owl 🦉";
    } else if (peakHour >= 6 && peakHour < 12) {
      return "Early Bird 🌅";
    } else if (peakHour >= 12 && peakHour < 17) {
      return "Afternoon Enthusiast ☀️";
    } else if (peakHour >= 17 && peakHour < 22) {
      return "Evening Listener 🌆";
    } else {
      return "Late Night Listener 🌙";
    }
  };

  useEffect(() => {
    console.log("Recent played data received:", recentlyPlayed);
    if (recentlyPlayed?.items) {
      // Initialize hours with better time formatting
      const hourCounts = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: 0,
        displayHour: `${i}:00`,
        timeOfDay: i < 12 ? 'AM' : 'PM',
        formattedHour: i === 0 ? '12 AM' : i < 12 ? `${i} AM` : i === 12 ? '12 PM' : `${i-12} PM`
      }));

      // Process each track
      recentlyPlayed.items.forEach(item => {
        const timestamp = new Date(item.played_at);
        const hour = timestamp.getHours();
        hourCounts[hour].count += 1;
      });

      console.log("Processed hourly data:", hourCounts);
      setHourlyData(hourCounts);
      setListenerType(getListenerType(hourCounts));
    }
  }, [recentlyPlayed]);

  if (!hourlyData.length) {
    return <div>Loading chart data...</div>;
  }

  return (
    <div style={{ 
      backgroundColor: '#282828', 
      padding: '30px', 
      margin: '20px',
      minHeight: '500px',
      width: '100%',
      color: 'white',
      borderRadius: '12px',
    }}>
      <h3 style={{ fontSize: '24px', marginBottom: '20px', textAlign: 'center' }}>
        Your Listening Patterns
      </h3>
      
      <div style={{ textAlign: 'center', marginBottom: '20px', color: '#b3b3b3' }}>
        You are a: <span style={{ color: '#1DB954', fontWeight: 'bold', fontSize: '20px' }}>{listenerType}</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        margin: '30px 0',
        padding: '20px',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#1DB954', fontSize: '24px', fontWeight: 'bold' }}>
            {getPeakListeningInsight(hourlyData).peakTime}
          </div>
          <div style={{ color: '#b3b3b3', fontSize: '14px' }}>Peak Listening Time</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#1DB954', fontSize: '24px', fontWeight: 'bold' }}>
            {getPeakListeningInsight(hourlyData).totalPlays}
          </div>
          <div style={{ color: '#b3b3b3', fontSize: '14px' }}>Total Tracks Played</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#1DB954', fontSize: '24px', fontWeight: 'bold' }}>
            {getPeakListeningInsight(hourlyData).peakPlays}
          </div>
          <div style={{ color: '#b3b3b3', fontSize: '14px' }}>Most Plays in One Hour</div>
        </div>
      </div>

      <div style={{ height: '400px', width: '100%', backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '8px' }}>
        <ResponsiveContainer>
          <LineChart data={hourlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="formattedHour" 
              stroke="#fff"
              interval={2}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              stroke="#fff"
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Number of Plays', 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: '#fff' }
              }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#282828',
                border: '1px solid #1DB954',
                borderRadius: '4px',
                color: '#fff'
              }}
              formatter={(value) => [`${value} plays`]}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="count" 
              stroke="#1DB954" 
              strokeWidth={3}
              dot={{ fill: '#1DB954', stroke: '#1DB954', r: 4 }}
              activeDot={{ r: 6, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ListeningTimeAnalysis;