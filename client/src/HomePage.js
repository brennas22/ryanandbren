import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

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

        // Check if the entered party code exists in the response
        if (data && data[partyCode]) {
          navigate(`/rsvp/${partyCode}`); // Navigate to RSVP page if the code is valid
        } else {
          setInvalidCodeError(
            "Invalid party code. Check your email for your code, or let Ryan and Brenna know if you're having trouble finding it!"
          );
        }
      } else {
        console.error("Error fetching party data");
        setInvalidCodeError(
          "There was an error connecting to the server. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching party data:", error);
      setInvalidCodeError(
        "An error occurred while processing your request. Please try again later."
      );
    }
  };

  return (
    <div className="home-container">
      <div className="inner-container">
      {/* Add both images */}
      {/* <img src="/engagement-mobile.jpg" alt="Mobile View" className="mobile-image" />
      <img src="/engagement-desktop.jpg" alt="Desktop View" className="desktop-image" /> */}
      <div className="image-container">
      <img src="/engagement-mobile.jpg" alt="Mobile View" className="mobile-image" />
  <img src="/engagement-desktop.jpg" alt="Desktop View" className="desktop-image" />
  <img src="/guest-ill1.png" alt="Guest Illustration" className="guest-illustration" />
</div>
      

      <h1>Celebrate with us on September 13th!</h1>
      <p>
        Thank you so much to everyone who celebrated with us in January - we had so much fun, we decided we should do it all again! 
        Just kidding, this was the plan all along. We're thrilled to invite you to our wedding on September 13th, 2025 
        (1 year and 8 months to the day after our first wedding). Enter your code from the invitiation to RSVP!
      </p>

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
      </div>
    </div>
  );
}

export default HomePage;
