const loginUrl = process.env.NODE_ENV === 'production'
  ? "/api/spotify/login"
  : "http://localhost:5000/api/spotify/login";

export { loginUrl };