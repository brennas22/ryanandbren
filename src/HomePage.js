import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import your CSS file

function HomePage() {
  const [partyCode, setPartyCode] = useState(""); // Store the party code input
  const [invalidCodeError, setInvalidCodeError] = useState(""); // Error message for invalid code
  const navigate = useNavigate(); // Use for redirection

  // Handle the form submission for the party code
  const handlePartyCodeSubmit = async (event) => {
    event.preventDefault();
    if (!partyCode) return;

    try {
      const response = await fetch("http://localhost:5001/partyData");
      if (response.ok) {
        const data = await response.json();

        // Check if the entered party code is valid
        const foundPartyKey = Object.keys(data).find(
          (partyCodeKey) => partyCodeKey.toLowerCase() === partyCode.toLowerCase()
        );

        if (foundPartyKey) {
          navigate(`/rsvp/${partyCode}`); // Navigate to RSVP page if the code is valid
        } else {
          setInvalidCodeError("Invalid party code. Check your email for your code, or let Ryan and Brenna know if you're having trouble finding it!");
        }
      } else {
        console.error("Error fetching party data");
      }
    } catch (error) {
      console.error("Error fetching party data:", error);
    }
  };

  return (
    <div className="container">
      <h1>Welcome to Our Wedding Website!</h1>
      <p>We're so excited to celebrate with you on [Date] at [Location].</p>

       {/* Add both images */}
      <img src="/mobile-image.png" alt="Mobile View" className="mobile-image" />
      <img src="/desktop-image.png" alt="Desktop View" className="desktop-image" />

      {/* Party code input form */}
      <form onSubmit={handlePartyCodeSubmit}>
        <input
          type="text"
          value={partyCode}
          onChange={(event) => setPartyCode(event.target.value)}
          placeholder="Enter your party code"
          className="input-field"
        />
        <button type="submit">RSVP</button>
        {/* Display error message if party code is invalid */}
        {invalidCodeError && <p className="error-message">{invalidCodeError}</p>}
      </form>

      {/* Keep the rest of the homepage content */}
    </div>
  );
}

export default HomePage;
