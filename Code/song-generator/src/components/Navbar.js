import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar() {
    return (
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid d-flex justify-content-between align-items-center">
          
          <Link to="/" className="navbar-brand d-flex align-items-center">
            <img src={logo} alt="Logo" width="100" height="100" className="me-2"/>
          </Link>
  
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item me-4">
                <Link to="/generate" className="nav-link">Generate Song</Link>
              </li>
              <li className="nav-item me-4">
                <Link to="/faq" className="nav-link">FAQ</Link>
              </li>
              <li className="nav-item">
                <Link to="/licensing" className="nav-link">Licensing</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }

export default Navbar;
