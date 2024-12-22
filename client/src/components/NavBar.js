import React from 'react';

const NavBar = ({ user }) => {
  return (
    <nav className="spotify-nav">
      <div className="nav-content">
        <div className="nav-left">
          <span className="nav-logo">Wrapped+</span>
          {user && (
            <span className="nav-welcome">
              Welcome, {user.display_name}
            </span>
          )}
        </div>
        
        <div className="nav-right">
          {user && (
            <button 
              className="nav-button"
              onClick={() => {
                // We'll implement logout later
                console.log('Logout clicked');
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;