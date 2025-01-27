// client/src/__tests__/components/ListeningTimeAnalysis.test.js
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ListeningTimeAnalysis from '../../components/ListeningTimeAnalysis';

describe('ListeningTimeAnalysis Component', () => {
  const mockData = {
    items: [
      {
        played_at: "2024-01-26T10:00:00Z",
        track: { name: "Test Track 1" }
      },
      {
        played_at: "2024-01-26T11:00:00Z",
        track: { name: "Test Track 2" }
      }
    ]
  };

  test('renders loading state when no data provided', () => {
    render(<ListeningTimeAnalysis />);
    expect(screen.getByText(/Loading chart data.../i)).toBeInTheDocument();
  });

  test('renders chart when data is provided', () => {
    render(<ListeningTimeAnalysis recentlyPlayed={mockData} />);
    expect(screen.getByText(/Your Listening Patterns/i)).toBeInTheDocument();
  });
});

// client/src/__tests__/components/GenreDiversity.test.js
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GenreDiversity from '../../components/GenreDiversity';

describe('GenreDiversity Component', () => {
  const mockTopArtists = {
    items: [
      {
        id: '1',
        name: 'Artist 1',
        genres: ['pop', 'rock'],
        images: [{ url: 'test.jpg' }],
        followers: { total: 1000 }
      },
      {
        id: '2',
        name: 'Artist 2',
        genres: ['jazz', 'blues'],
        images: [{ url: 'test2.jpg' }],
        followers: { total: 2000 }
      }
    ]
  };

  test('renders genre statistics correctly', () => {
    render(<GenreDiversity topArtists={mockTopArtists} />);
    expect(screen.getByText(/Your Year in Genres/i)).toBeInTheDocument();
  });

  test('displays correct number of genres', () => {
    render(<GenreDiversity topArtists={mockTopArtists} />);
    const genres = ['pop', 'rock', 'jazz', 'blues'];
    genres.forEach(genre => {
      expect(screen.getByText(new RegExp(genre, 'i'))).toBeInTheDocument();
    });
  });
});

// client/src/__tests__/hooks/useSpotifyAuth.test.js
import { renderHook } from '@testing-library/react-hooks';
import useSpotifyAuth from '../../hooks/useSpotifyAuth';

describe('useSpotifyAuth Hook', () => {
  beforeEach(() => {
    window.location.hash = '';
    localStorage.clear();
  });

  test('returns null when no token present', () => {
    const { result } = renderHook(() => useSpotifyAuth());
    expect(result.current).toBeNull();
  });

  test('extracts token from URL hash', () => {
    window.location.hash = '#access_token=mock_token';
    const { result } = renderHook(() => useSpotifyAuth());
    expect(result.current).toBe('mock_token');
  });
});

// server/__tests__/routes/spotify.test.js
const request = require('supertest');
const express = require('express');
const spotifyRoutes = require('../../routes/spotify');

const app = express();
app.use('/api/spotify', spotifyRoutes);

describe('Spotify Routes', () => {
  test('GET /api/spotify/login redirects to Spotify auth', async () => {
    const response = await request(app).get('/api/spotify/login');
    expect(response.status).toBe(302); // Redirect status code
    expect(response.header.location).toContain('accounts.spotify.com/authorize');
  });

  test('GET /api/spotify/callback handles missing code', async () => {
    const response = await request(app).get('/api/spotify/callback');
    expect(response.status).toBe(500);
  });
});

// client/src/__tests__/services/SpotifyApi.test.js
import * as SpotifyApi from '../../services/SpotifyApi';

describe('SpotifyApi Service', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('setAccessToken stores token in localStorage', () => {
    SpotifyApi.setAccessToken('test_token');
    expect(localStorage.getItem('spotifyToken')).toBe('test_token');
  });

  test('getRecentlyPlayed throws error without token', async () => {
    await expect(SpotifyApi.getRecentlyPlayed()).rejects.toThrow('No access token available');
  });
});

// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// __mocks__/fileMock.js
module.exports = 'test-file-stub';

// server/__tests__/setup.js
process.env.SPOTIFY_CLIENT_ID = 'test_client_id';
process.env.SPOTIFY_CLIENT_SECRET = 'test_client_secret';
process.env.SPOTIFY_REDIRECT_URI = 'http://localhost:5000/api/spotify/callback';