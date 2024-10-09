import React, { useState, useEffect } from "react";
import "./RSVP.css";

function RSVP() {
  const [code, setCode] = useState("");
  const [party, setParty] = useState(null);
  const [partyFetched, setPartyFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message

  const [memberRSVPs, setMemberRSVPs] = useState({});
  const [memberAllergies, setMemberAllergies] = useState({});

  const guestImages = [
    'guest-ill1.png',
    'guest-ill2.png',
    'guest-ill3.png',
    'guest-ill4.png',
  ];

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
    const enteredCode = code.toLowerCase();
    const foundPartyKey = Object.keys(party).find(
      (partyCode) => partyCode.toLowerCase() === enteredCode
    );

    if (foundPartyKey) {
      const foundParty = party[foundPartyKey];
      setParty(foundParty);
      setPartyFetched(true);

      const initialRSVPs = {};
      const initialAllergies = {};
      foundParty.members.forEach((member) => {
        initialRSVPs[member.name] = null;
        initialAllergies[member.name] = member.allergies || ""; // Initialize allergies as empty string if null
      });
      setMemberRSVPs(initialRSVPs);
      setMemberAllergies(initialAllergies);
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  const handleRSVPChange = (memberId, newRsvpStatus) => {
    setShowSuccess(false);
    setErrorMessage(""); // Clear any error messages when changing RSVP
    setMemberRSVPs((prevRSVPs) => ({
      ...prevRSVPs,
      [memberId]: newRsvpStatus,
    }));
  };

  const handleAllergyChange = (memberId, newAllergies) => {
    setShowSuccess(false);
    setMemberAllergies((prevAllergies) => ({
      ...prevAllergies,
      [memberId]: newAllergies,
    }));
  };

  const handleRSVP = async () => {
    // Check if all members have an RSVP status
    const allRSVPsSelected = Object.values(memberRSVPs).every(
      (rsvp) => rsvp !== null
    );

    if (!allRSVPsSelected) {
      setErrorMessage("Please choose an RSVP status for all guests.");
      return;
    }

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

      {partyFetched && party && (
        <div>
          {party.guests && <p>Number of Guests: {party.guests}</p>}

          {party.note && <p>{party.note}</p>}

          {party.photos && (
            <div className="party-image-container">
              {party.photos.map((photo, index) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Party photo ${index + 1}`}
                  className="party-images"
                />
              ))}
            </div>
          )}

          {party.members && (
            <>
              <ul className="guest-list">
                {party.members.map((member, index) => (
                  <li key={member.name} className="guest-card">
                    <div className="guest-card-content">
                      {/* Assign image to guest, cycling through the array */}
                      <img
                        src={guestImages[index % guestImages.length]} // Cycle through images
                        alt="Guest illustration"
                        className="guest-card-image"
                      />
                      <div className="guest-details">
                        <div><strong>{member.name}</strong></div>

                        {/* RSVP Chips Below the Name */}
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

                        {/* Conditionally render allergies textarea below, without label */}
                        {memberRSVPs[member.name] === "yes" && (
                          <div className="allergy-container">
                            <textarea
                              id={`${member.name}-allergies`}
                              className="input-textarea"
                              value={memberAllergies[member.name]}
                              onChange={(e) => handleAllergyChange(member.name, e.target.value)}
                              placeholder={
                                memberAllergies[member.name] === ""
                                  ? "Please let us know about any dietary restrictions"
                                  : ""
                              }
                              rows="3"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Display error message if RSVP status is not selected for all guests */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {party.members && (
            <button onClick={handleRSVP} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit RSVP"}
            </button>
          )}

          {showSuccess && <div className="success-message">{successMessage}</div>}
        </div>
      )}
    </div>
  );
}

export default RSVP;
