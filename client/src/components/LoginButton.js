// src/components/LoginButton.js
import React from "react";
import { loginUrl } from "../services/SpotifyAuth";

const LoginButton = () => (
  <a href={loginUrl}>
    <button>Login with Spotify</button>
  </a>
);

export default LoginButton;
