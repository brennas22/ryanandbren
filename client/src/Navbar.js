import React, { useState } from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link 
        to="/" 
        className="navbar-logo"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Ryan & Brenna
      </Link> 
      <div className="hamburger-menu" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </div>
      {isMenuOpen && (
        <div
          className={`overlay ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
      <div className={`navbar-links ${isMenuOpen ? 'open' : ''}`}>
        <button className="close-button" onClick={() => setIsMenuOpen(false)}>
          &times;
        </button>
        <Link to="/about-me" onClick={closeMobileMenu}>Gifts</Link>
        <Link to="/faq" rel="noopener noreferrer">FAQs</Link>
      </div>
    </nav>
  );
};

export default Navbar;
