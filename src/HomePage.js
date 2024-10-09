import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import your CSS file

function HomePage() {
  return (
    <div className="container">
      <h1>Welcome to Our Wedding Website!</h1>
      <p>We're so excited to celebrate with you on [Date] at [Location].</p>

      {/* Add both images */}
      <img src="/mobile-image.png" alt="Mobile View" className="mobile-image" />
      <img src="/desktop-image.png" alt="Desktop View" className="desktop-image" />

      <Link to="/rsvp" className="rsvp-link">RSVP Here</Link> {/* Add a class to the link */}
    </div>
  );
}

export default HomePage;

