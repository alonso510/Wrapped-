import React from "react";
import LogoutButton from "./LogoutButton";

const NavBar = ({ user }) => {
  return (
    <div
      className="spotify-nav"
      style={{
        backgroundColor: "#000000",
        padding: "20px",
        width: "100%",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        className="nav-content"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="nav-left">
          <div
            className="nav-logo"
            style={{
              color: "#1DB954",
              fontSize: "24px",
              fontWeight: "bold",
            }}
          >
            Wrapped+
          </div>
          {user && (
            <div
              className="nav-welcome"
              style={{
                color: "#ffffff",
                marginLeft: "20px",
              }}
            >
              Welcome, {user.display_name}
            </div>
          )}
        </div>
        <div className="nav-right">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
