import React from "react";

const LogoutButton = () => {
  const handleLogout = () => {
    // Remove the access token from local storage or session storage
    localStorage.removeItem("spotifyAuthToken");
    sessionStorage.removeItem("spotifyAuthToken");

    // Redirect to the login page
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        backgroundColor: "#1DB954",
        color: "#ffffff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "50px",
        fontSize: "1em",
        fontWeight: "bold",
        cursor: "pointer",
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
