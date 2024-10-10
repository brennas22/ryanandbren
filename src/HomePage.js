import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import './HomePage.css'; // Import your CSS file

function HomePage() {
  const [partyCode, setPartyCode] = useState(""); // Store the party code input
  const navigate = useNavigate(); // Use useNavigate for navigation

  const handleCodeChange = (event) => {
    setPartyCode(event.target.value); // Update the party code as the user types
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Redirect to RSVP page with the party code as a URL parameter
    navigate(`/rsvp/${partyCode}`);
  };

  return (
    <div className="container">
      <h1>Welcome to Our Wedding Website!</h1>
      <p>We're so excited to celebrate with you on [Date] at [Location].</p>

      {/* Add both images */}
      <img src="/mobile-image.png" alt="Mobile View" className="mobile-image" />
      <img src="/desktop-image.png" alt="Desktop View" className="desktop-image" />

      {/* Party code input form */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={partyCode}
          onChange={handleCodeChange}
          placeholder="Enter your party code"
          className="input-field"
        />
        <button type="submit">Go to RSVP</button>
      </form>

      
    </div>
  );
}

export default HomePage;
