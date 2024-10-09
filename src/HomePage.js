import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; // Import your CSS file

function HomePage() {
  return (
    <div className="container"> {/* Add a container */}
      <h1>Welcome to Our Wedding Website!</h1>
      <p>We're so excited to celebrate with you on [Date] at [Location].</p>
      <Link to="/rsvp" className="rsvp-link">RSVP Here</Link> {/* Add a class to the link */}
      {/* Add more content as needed */}
    </div>
  );
}

export default HomePage;
