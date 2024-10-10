import React, { useState, useEffect } from "react";
import "./RSVP.css";

function RSVP() {
  const [code, setCode] = useState("");
  const [party, setParty] = useState(null);
  const [partyFetched, setPartyFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendingCount, setAttendingCount] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false); // Track if RSVP has been submitted

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
      let rsvpAlreadySubmitted = false; // Track if RSVP was already submitted
      let initialCount = 0; // Track number of guests initially marked as "yes"

      // Initialize RSVP and allergy states from partyData.json
      foundParty.members.forEach((member) => {
        const fullName = `${member.firstname} ${member.lastname}`;
        initialRSVPs[fullName] = member.rsvp ? member.rsvp : null;

        // If RSVP is "yes", increase the count
        if (member.rsvp === "yes") {
          initialCount += 1;
          rsvpAlreadySubmitted = true;
        }

        // Initialize allergies
        initialAllergies[fullName] = member.allergies || "";
      });

      // Set the initial attending count based on the data
      setAttendingCount(initialCount);

      // If RSVP was already submitted, set the submitted state and success message
      if (rsvpAlreadySubmitted) {
        setRsvpSubmitted(true);
        setShowSuccess(true); // Ensure the success message is shown
        calculateSuccessMessage(initialRSVPs); // Calculate and display the success message based on existing data
      } else {
        // Check if all RSVPs are "no" to set the "We'll miss you" message
        const allNoRSVPs = Object.values(initialRSVPs).every((rsvp) => rsvp === "no");
        if (allNoRSVPs) {
          setRsvpSubmitted(true);
          setShowSuccess(true);
          setSuccessMessage("We'll miss you, but hope to see you soon!");
        }
      }

      setMemberRSVPs(initialRSVPs);
      setMemberAllergies(initialAllergies);
    } else {
      alert("Invalid code. Please try again.");
    }
  };

  // Generate the greeting for the party note using first names
  const generateGreeting = (members) => {
    const firstNames = members.map(member => member.firstname);
    
    if (firstNames.length === 1) {
      return `Dear ${firstNames[0]},`;
    } else if (firstNames.length === 2) {
      return `Dear ${firstNames[0]} and ${firstNames[1]},`;
    } else {
      const guestList = firstNames.slice(0, -1).join(", ");
      const lastGuest = firstNames[firstNames.length - 1];
      return `Dear ${guestList}, and ${lastGuest},`;
    }
  };

  // Update the RSVP status for each guest
  const handleRSVPChange = (fullName, newRsvpStatus) => {
    setShowSuccess(false);
    setErrorMessage(""); // Clear any error messages when changing RSVP

    // Update attending count, ensuring it doesn't go negative
    setAttendingCount((prevCount) => {
      const isCurrentlyYes = memberRSVPs[fullName] === "yes";
      if (newRsvpStatus === "yes" && !isCurrentlyYes) {
        return prevCount + 1;
      }
      if (newRsvpStatus === "no" && isCurrentlyYes) {
        return Math.max(prevCount - 1, 0); // Ensure count never goes below 0
      }
      return prevCount;
    });

    setMemberRSVPs((prevRSVPs) => ({
      ...prevRSVPs,
      [fullName]: newRsvpStatus,
    }));
  };

  const handleAllergyChange = (fullName, newAllergies) => {
    setShowSuccess(false);
    setMemberAllergies((prevAllergies) => ({
      ...prevAllergies,
      [fullName]: newAllergies,
    }));
  };

  const handleRSVP = async () => {
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
        setRsvpSubmitted(true); // Mark RSVP as submitted
        calculateSuccessMessage(memberRSVPs); // Calculate success message based on current RSVPs
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

  // Function to calculate and set the success message (using first names only)
  const calculateSuccessMessage = (rsvpData) => {
    const attendingGuests = Object.keys(rsvpData).filter(
      (guestName) => rsvpData[guestName] === "yes"
    );

    const attendingFirstNames = attendingGuests.map((fullName) => {
      return fullName.split(" ")[0]; // Extract first name
    });

    if (attendingFirstNames.length === 0) {
      setSuccessMessage("We'll miss you, but hope to see you soon!");
    } else if (attendingFirstNames.length === 1) {
      setSuccessMessage(`We can't wait to celebrate with you, ${attendingFirstNames[0]}!`);
    } else {
      const guestList = attendingFirstNames.slice(0, -1).join(", ");
      const lastGuest = attendingFirstNames[attendingFirstNames.length - 1];
      setSuccessMessage(`We can't wait to celebrate with you, ${guestList} and ${lastGuest}!`);
    }
  };

  // Determine if at least one RSVP is selected to show the bottom bar
  const atLeastOneRSVP = Object.values(memberRSVPs).some((rsvp) => rsvp !== null);

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

           {party.note && (
            <div className="guest-note-card">
              <p>{generateGreeting(party.members)}</p>
              <div  className="party-note">
                <p>{party.note}</p>
              </div>
              <p>Love,</p>
              <p>Ryan and Brenna</p>
            </div>
          )}

          {party.members && (
            <>
              <ul className="guest-list">
                {party.members.map((member, index) => {
                  const fullName = `${member.firstname} ${member.lastname}`;
                  return (
                    <li key={fullName} className="guest-card">
                      <div className="guest-card-content">
                        {/* Assign image to guest, cycling through the array */}
                        <img
                          src={guestImages[index % guestImages.length]} // Cycle through images
                          alt="Guest illustration"
                          className="guest-card-image"
                        />
                        <div className="guest-details">
                          {/* Show both first and last name on guest card */}
                          <div><strong>{`${member.firstname} ${member.lastname}`}</strong></div>

                          {/* RSVP Chips Below the Name */}
                          <div className="chip-container">
                            <button
                              className={`chip ${memberRSVPs[fullName] === "yes" ? "active" : ""}`}
                              onClick={() => handleRSVPChange(fullName, "yes")}
                            >
                              Will be attending
                            </button>
                            <button
                              className={`chip ${memberRSVPs[fullName] === "no" ? "active" : ""}`}
                              onClick={() => handleRSVPChange(fullName, "no")}
                            >
                              Sadly cannot attend
                            </button>
                          </div>

                          {/* Conditionally render allergies textarea below, without label */}
                          {memberRSVPs[fullName] === "yes" && (
                            <div className="allergy-container">
                              <textarea
                                id={`${fullName}-allergies`}
                                className="input-textarea"
                                value={memberAllergies[fullName]}
                                onChange={(e) => handleAllergyChange(fullName, e.target.value)}
                                placeholder={
                                  memberAllergies[fullName] === ""
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
                  );
                })}
              </ul>
            </>
          )}

          {/* Conditionally render the sticky bottom bar once at least one RSVP is selected */}
          {atLeastOneRSVP && (
            <div className="bottom-bar">
              {/* Show success message or guest count */}
              {showSuccess && successMessage ? (
                <p>{successMessage}</p>
              ) : (
                <>
                  <p>Guests Attending: {attendingCount}</p>
                  {/* Show error message if there's an error */}
                  {errorMessage && <p className="error-message-bar">{errorMessage}</p>}
                </>
              )}

              {/* Change button CTA to 'Re-submit RSVP' after submission */}
              <button onClick={handleRSVP} disabled={isLoading}>
                {isLoading ? "Submitting..." : rsvpSubmitted ? "Re-submit RSVP" : "Submit RSVP"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RSVP;
