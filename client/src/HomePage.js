import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import your CSS file



function HomePage() {
  const [partyCode, setPartyCode] = useState(""); // Store the party code input
  const [invalidCodeError, setInvalidCodeError] = useState(""); // Error message for invalid code
  const navigate = useNavigate(); // Use for redirection
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  // Handle the form submission for the party code
  const handlePartyCodeSubmit = async (event) => {
    event.preventDefault();
    if (!partyCode) return;

    try {
      const response = await fetch(`${API_URL}/partyData/${partyCode}`);
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


       {/* Add both images */}
      <img src="/mobile-image.png" alt="Mobile View" className="mobile-image" />
      <img src="/desktop-image.png" alt="Desktop View" className="desktop-image" />

      <h1>Ryan and Brenna are getting married (Again)!</h1>
      <p>Thank you so much to everyone who celebrated with us in January - we had so much fun, we decided we should do it all again! 
      Just kidding, this was the plan all along. We're thrilled to invite you to save the date for our wedding on September 13th, 2025 
      (1 year and 8 months to the day after our first wedding). We'll be having a ceremony - since the first one was just immediate family - 
      followed by dinner, drinks, and dancing at Sarma, one of our absolute favorite restaurants, located in Somerville, MA. More details to follow soon!</p>

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
