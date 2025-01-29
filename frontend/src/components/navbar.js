import React from "react";
import logo from '../images/ChronoCanvasLogo.png';
import navbarBackground from '../images/navbarBackground.png';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="fixed-top">
      <nav
        className="navbar navbar-light py-2 px-3"
        style={{
          backgroundImage: `url(${navbarBackground})`, // Set the background image
          backgroundSize: "cover", // Ensure the image covers the entire navbar
          backgroundRepeat: "no-repeat", // Prevent tiling
          backgroundPosition: "center", // Center the image
        }}
      >
        <div className="container-fluid">
          {/* Logo on the left */}
          <div className="d-flex align-items-center">
            <Link to="/">
              <img 
                src={logo} 
                height="80px" 
                alt="ChronoCanvas Logo" 
                className="navbar-brand" 
                style={{
                  cursor: "pointer",
                  borderRadius: "20%",
                  objectFit: "cover", 
                }}
              />
            </Link>
          </div>

          {/* Title in the center */}
          <div className="d-flex justify-content-center flex-grow-1">
            <h1 className="text-dark m-0 bg-light rounded px-3 ms-2">
                Chrono<b>Canvas</b>
            </h1>
          </div>

          {/* Subtitle on the right */}
          <div className="d-flex align-items-center">
            <p className="text-light m-0 bg-dark rounded px-2">Paint Your Day</p>
          </div>
        </div>
      </nav>
    </div>
  );
}
