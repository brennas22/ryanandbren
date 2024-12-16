import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import Masonry from 'react-masonry-css';
import "./RSVP.css";

function RSVP() {
  const { partyCode } = useParams();
  const navigate = useNavigate();
  const [party, setParty] = useState(null);
  const [partyFetched, setPartyFetched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attendingCount, setAttendingCount] = useState(0);
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [invalidCodeError, setInvalidCodeError] = useState(""); // Error message for invalid code


  const [memberRSVPs, setMemberRSVPs] = useState({});
  const [memberAllergies, setMemberAllergies] = useState({});
  const [inputPartyCode, setInputPartyCode] = useState(partyCode || "");


  const guestImages = [
    '/guest-ill1.png', 
    '/guest-ill2.png',
    '/guest-ill3.png',
    '/guest-ill4.png',
  ];


const breakpointColumns = {
  default: 3, // Number of columns on large screens
  1100: 2,    // 2 columns for medium screens
  700: 1,     // 1 column for small screens
};

  useEffect(() => {
    if (partyCode) {
      const fetchPartyData = async () => {
        try {
          const response = await fetch("http://localhost:5001/partyData");
          if (response.ok) {
            const data = await response.json();

            const foundPartyKey = Object.keys(data).find(
              (partyCodeKey) => partyCodeKey.toLowerCase() === partyCode.toLowerCase()
            );

            if (foundPartyKey) {
              const foundParty = data[foundPartyKey];
              setParty(foundParty);
              setPartyFetched(true);

              const initialRSVPs = {};
              const initialAllergies = {};
              let rsvpAlreadySubmitted = false;
              let initialCount = 0;

              foundParty.members.forEach((member) => {
                const fullName = `${member.firstname} ${member.lastname}`;
                initialRSVPs[fullName] = member.rsvp ? member.rsvp : null;

                if (member.rsvp === "yes") {
                  initialCount += 1;
                  rsvpAlreadySubmitted = true;
                }

                initialAllergies[fullName] = member.allergies || "";
              });

              setAttendingCount(initialCount);

              if (rsvpAlreadySubmitted) {
                setRsvpSubmitted(true);
                setShowSuccess(true);
                calculateSuccessMessage(initialRSVPs);
              } else {
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
              setInvalidCodeError("Invalid party code. Check your email for your code, or let Ryan and Brenna know if you're having trouble finding it!");
            }
          } else {
            console.error("Error fetching party data");
          }
        } catch (error) {
          console.error("Error fetching party data:", error);
        }
      };

      fetchPartyData();
    }
  }, [partyCode]);

  // Define the generateGreeting function here
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

  // Handle RSVP status changes
  const handleRSVPChange = (fullName, newRsvpStatus) => {
    setShowSuccess(false);
    setErrorMessage("");

    setAttendingCount((prevCount) => {
      const isCurrentlyYes = memberRSVPs[fullName] === "yes";
      if (newRsvpStatus === "yes" && !isCurrentlyYes) {
        return prevCount + 1;
      }
      if (newRsvpStatus === "no" && isCurrentlyYes) {
        return Math.max(prevCount - 1, 0);
      }
      return prevCount;
    });

    setMemberRSVPs((prevRSVPs) => ({
      ...prevRSVPs,
      [fullName]: newRsvpStatus,
    }));
  };

  // Handle allergy changes
  const handleAllergyChange = (fullName, newAllergies) => {
    setShowSuccess(false);
    setMemberAllergies((prevAllergies) => ({
      ...prevAllergies,
      [fullName]: newAllergies,
    }));
  };

  // Handle form submission to submit the RSVP data
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
        body: JSON.stringify({ code: partyCode, memberRSVPs, memberAllergies }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setRsvpSubmitted(true);
        calculateSuccessMessage(memberRSVPs);
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

 const calculateSuccessMessage = (rsvpData) => {
  const attendingGuests = Object.keys(rsvpData).filter(
    (guestName) => rsvpData[guestName] === "yes"
  );

  const attendingFirstNames = attendingGuests.map((fullName) => {
    return fullName.split(" ")[0];
  });

  if (attendingFirstNames.length === 0) {
    setSuccessMessage(
      <>
        We'll miss you, but hope to see you soon!{" "}
        
      </>
    );
  } else if (attendingFirstNames.length === 1) {
    setSuccessMessage(
      <>
        We can't wait to celebrate with you, {attendingFirstNames[0]}!{" "}
        <a href="/faq" style={{ color: "#FFFFFF", textDecoration: "underline" }}>
          Check out our FAQs
        </a>
      </>
    );
  } else {
    const guestList = attendingFirstNames.slice(0, -1).join(", ");
    const lastGuest = attendingFirstNames[attendingFirstNames.length - 1];
    setSuccessMessage(
      <>
        We can't wait to celebrate with you, {guestList} and {lastGuest}!{" "}
        <a href="/faq" style={{ color: "#FFFFFF", textDecoration: "underline" }}>
          Check out our FAQs
        </a>
      </>
    );
  }
};


  const atLeastOneRSVP = Object.values(memberRSVPs).some((rsvp) => rsvp !== null);

  // Submit party code and check for validity without navigating
  const handlePartyCodeSubmit = async (event) => {
    event.preventDefault();
    if (!inputPartyCode) return;

    try {
      const response = await fetch("http://localhost:5001/partyData");
      if (response.ok) {
        const data = await response.json();

        const foundPartyKey = Object.keys(data).find(
          (partyCodeKey) => partyCodeKey.toLowerCase() === inputPartyCode.toLowerCase()
        );

        if (foundPartyKey) {
          navigate(`/rsvp/${inputPartyCode}`); // Navigate if the code is valid
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
  <div className="rsvp-container">
    <h1>Let us know if you can come!</h1>

    {/* If no party code is provided, show the party code input */}
    {!partyCode && (
      <form onSubmit={handlePartyCodeSubmit}>
        <input
          type="text"
          value={inputPartyCode}
          onChange={(event) => setInputPartyCode(event.target.value)}
          placeholder="Enter your party code"
          className="input-field"
        />
        <button type="submit">RSVP</button>
        {invalidCodeError && <p className="error-message">{invalidCodeError}</p>}
      </form>
    )}

    {partyFetched && party && (
      <>
        {/* Constrained Section (Notes and Guest List) */}
        <div className="constrained-section">
          {party.note && (
            <div className="guest-note-card">
              <p>{generateGreeting(party.members)}</p>
              <div className="party-note">
                <p>{party.note}</p>
              </div>
              <p>Love,</p>
              <p>Ryan and Brenna</p>
              {party.members && (
            <ul className="guest-list">
              {party.members.map((member, index) => {
                const fullName = `${member.firstname} ${member.lastname}`;
                return (
                  <li key={fullName} className="guest-card">
                    <div className="guest-card-content">
                      <img
                        src={guestImages[index % guestImages.length]}
                        alt="Guest illustration"
                        className="guest-card-image"
                      />
                      <div className="guest-details">
                        <div>
                          <strong>{`${member.firstname} ${member.lastname}`}</strong>
                        </div>
                        <div className="chip-container">
                          <button
                            className={`chip ${
                              memberRSVPs[fullName] === "yes" ? "active" : ""
                            }`}
                            onClick={() => handleRSVPChange(fullName, "yes")}
                          >
                            Will be attending
                          </button>
                          <button
                            className={`chip ${
                              memberRSVPs[fullName] === "no" ? "active" : ""
                            }`}
                            onClick={() => handleRSVPChange(fullName, "no")}
                          >
                            Sadly cannot attend
                          </button>
                        </div>

                        {memberRSVPs[fullName] === "yes" && (
                          <div className="allergy-container">
                            <textarea
                              id={`${fullName}-allergies`}
                              className="input-textarea"
                              value={memberAllergies[fullName]}
                              onChange={(e) =>
                                handleAllergyChange(fullName, e.target.value)
                              }
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
          )}
            </div>
          )}

          
        </div>

        {/* Party Photos Section (Moved Below Guest Notes and RSVP Section) */}
        {party.photos && (
          <Masonry
            breakpointCols={breakpointColumns}
            className="party-image-container"
            columnClassName="party-masonry-column"
          >
            {party.photos.map((photo, index) => (
              <img
                key={index}
                src={photo}
                alt={`Party photo ${index + 1}`}
                className="party-images"
              />
            ))}
          </Masonry>
        )}

        {/* Bottom Bar for RSVP Summary */}
        {atLeastOneRSVP && (
          <div className="bottom-bar">
            {showSuccess && successMessage ? (
              <p>{successMessage}</p>
            ) : (
              <>
                <p>Guests Attending: {attendingCount}</p>
                {errorMessage && <p className="error-message-bar">{errorMessage}</p>}
              </>
            )}
            <button onClick={handleRSVP} disabled={isLoading}>
              {isLoading ? "Submitting..." : rsvpSubmitted ? "Update RSVP" : "Submit RSVP"}
            </button>
          </div>
        )}
      </>
    )}
  </div>
);


}

export default RSVP;
