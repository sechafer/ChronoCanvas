import React from "react";
import logo from '../images/ChronoCanvasLogo.png';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <div className="fixed-top">
      <nav className="navbar navbar-light bg-dark py-2">
        <div className="container-fluid d-flex align-items-center justify-content-between">
          {/* Logo on the left */}
          <div>
            <Link to="/">
              <img 
                src={logo} 
                height="75px" 
                alt="ChronoCanvas Logo" 
                className="d-inline-block logo navbar-brand" 
                style={{ cursor: "pointer" }}
              />
            </Link>
          </div>

          {/* Title and subtitle in the center */}
          <div className="text-center flex-grow-1 pe-5 me-5">
            <h1 className="text-light m-0">ChronoCanvas</h1>
            <p className="text-light m-0">Paint Your Day</p>
          </div>
        </div>
      </nav>
    </div>
  );
}
