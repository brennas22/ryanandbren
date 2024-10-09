import React, { useState, useEffect } from "react";
import "./RSVP.css";

function RSVP() {
  const [code, setCode] = useState("");
  const [party, setParty] = useState(null);
  const [partyFetched, setPartyFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // State to track RSVP status for each member
  const [memberRSVPs, setMemberRSVPs] = useState({});
  // State to track allergies for each member
  const [memberAllergies, setMemberAllergies] = useState({});

  useEffect(() => {
    const fetchPartyData = async () => {
      try {
        const response = await fetch("http://localhost:5001/partyData");
        if (response.ok) {
          const data = await response.json();
          setParty(data);
        } else {
          console.error("Error fetching party data");
        }
      } catch (error) {
        console.error("Error fetching party data:", error);
      }
    };

    fetchPartyData();
  }, []);

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

 const handleSubmit = () => {
  // Convert the entered code to lowercase
  const enteredCode = code.toLowerCase();

  // Convert party codes to lowercase and find the matching party
  const foundPartyKey = Object.keys(party).find(
    (partyCode) => partyCode.toLowerCase() === enteredCode
  );

  if (foundPartyKey) {
    const foundParty = party[foundPartyKey]; // Access the party object using the found key
    setParty(foundParty);
    setPartyFetched(true);

    // Initialize member RSVPs and allergies
    const initialRSVPs = {};
    const initialAllergies = {};
    foundParty.members.forEach((member) => {
      initialRSVPs[member.name] = null;
      initialAllergies[member.name] = member.allergies;
    });
    setMemberRSVPs(initialRSVPs);
    setMemberAllergies(initialAllergies);
  } else {
    alert("Invalid code. Please try again.");
  }
};


  const handleRSVPChange = (memberId, newRsvpStatus) => {
    // Hide the success message when the user changes RSVP status
    setShowSuccess(false);
    setMemberRSVPs((prevRSVPs) => ({
      ...prevRSVPs,
      [memberId]: newRsvpStatus,
    }));
  };

  const handleAllergyChange = (memberId, newAllergies) => {
    // Hide the success message when the user changes allergies
    setShowSuccess(false);
    setMemberAllergies((prevAllergies) => ({
      ...prevAllergies,
      [memberId]: newAllergies,
    }));
  };

  const handleRSVP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5001/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, memberRSVPs, memberAllergies }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setSuccessMessage("RSVP submitted successfully!");

        // Update RSVP status and allergies in the local state
        setParty((prevParty) => ({
          ...prevParty,
          members: prevParty.members.map((member) => ({
            ...member,
            rsvp: memberRSVPs[member.name],
            allergies: memberAllergies[member.name],
          })),
        }));
      } else {
        const data = await response.json();
        console.error("RSVP failed:", data.error);
        alert("RSVP failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending RSVP:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rsvp-container">
      <h1>RSVP</h1>

      
      {!partyFetched && (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={code}
            onChange={handleCodeChange}
            placeholder="Enter your party code"
            className="input-field"
          />
          <button type="submit">Submit Code</button>
        </form>
      )}

      {partyFetched && party && ( // Conditionally render the party section when the code is valid
        <div>
          {party.guests && (
            <p>Number of Guests: {party.guests}</p>
          )}

          {party.note && <p>{party.note}</p>}

         {party.photos && (
  <div className="rsvp-image-container">
    {party.photos.map((photo, index) => (
      <img
        key={index}
        src={photo}
        alt={`Wedding photo ${index + 1}`}
        className="rsvp-images"  // Apply the image class
      />
    ))}
  </div>
)}



          {party.members && (
            <>
              <ul className="guest-list">
                {party.members.map((member) => (
                  <li key={member.name} style={{ marginBottom: "20px" }}>
                    <div><strong>{member.name}</strong></div>
                    
                    <div className="chip-container">
                      <button
                        className={`chip ${memberRSVPs[member.name] === "yes" ? "active" : ""}`}
                        onClick={() => handleRSVPChange(member.name, "yes")}
                      >
                        Will be attending
                      </button>
                      <button
                        className={`chip ${memberRSVPs[member.name] === "no" ? "active" : ""}`}
                        onClick={() => handleRSVPChange(member.name, "no")}
                      >
                        Sadly cannot attend
                      </button>
                    </div>

                    {memberRSVPs[member.name] === "yes" && (  // Conditionally render allergies input
                      <div>
                        <label htmlFor={`${member.name}-allergies`}>
                          Allergies:
                        </label>
                        <input
                          type="text"
                          id={`${member.name}-allergies`}
                          className="input-field"
                          value={memberAllergies[member.name]}
                          onChange={(e) =>
                            handleAllergyChange(member.name, e.target.value)
                          }
                        />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {party.members && (
            <button onClick={handleRSVP} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit RSVP"}
            </button>
          )}

          {showSuccess && (
            <div className="success-message">{successMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}

export default RSVP;
