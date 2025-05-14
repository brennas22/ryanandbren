import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Masonry from "react-masonry-css";
import FAQ from "./FAQ";
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
  const [invalidCodeError, setInvalidCodeError] = useState("");
  const [memberRSVPs, setMemberRSVPs] = useState({});
  const [memberAllergies, setMemberAllergies] = useState({});
  const [inputPartyCode, setInputPartyCode] = useState(partyCode || "");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

  const guestImages = [
    "/guest-ill1.png",
    "/guest-ill2.png",
    "/guest-ill3.png",
    "/guest-ill4.png",
  ];

  const breakpointColumns = {
    default: 4,
    1600: 3,
    1200: 2,
    700: 1,
  };

  useEffect(() => {
    console.log("Fetched party data:", party);
  }, [party]);
  

  useEffect(() => {
    if (partyCode) {
      const fetchPartyData = async () => {
        try {
          const response = await fetch(`${API_URL}/partyData/${partyCode}`);
          if (response.ok) {
            const data = await response.json();
            const foundParty = data[partyCode];

            if (foundParty) {
              setParty(foundParty);
              setPartyFetched(true);

              const initialRSVPs = {};
              const initialAllergies = {};
              let initialCount = 0;
              let rsvpAlreadySubmitted = false;

              foundParty.members.forEach((member) => {
                const fullName = `${member.first_name} ${member.last_name}`;
                initialRSVPs[fullName] = member.rsvp || null;

                if (member.rsvp === true) {
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
              } else if (Object.values(initialRSVPs).every((rsvp) => rsvp === false)) {
                setRsvpSubmitted(true);
                setShowSuccess(true);
                setSuccessMessage("We'll miss you, but hope to see you soon!");
              }

              setMemberRSVPs(initialRSVPs);
              setMemberAllergies(initialAllergies);
            } else {
              setInvalidCodeError("Invalid party code. Please check your email for your code.");
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

  const generateGreeting = (members) => {
    if (!Array.isArray(members) || members.length === 0) {
      // Handle cases where members are undefined or empty
      return "Dear Guest,";
    }
  
    const firstNames = members.map((member) => member.first_name);
  
    if (firstNames.length === 1) {
      return `We hope you can join us ${firstNames[0]}!`;
    } else if (firstNames.length === 2) {
      return `We hope you can join us, ${firstNames[0]} and ${firstNames[1]}!`;
    } else {
      const guestList = firstNames.slice(0, -1).join(", ");
      const lastGuest = firstNames[firstNames.length - 1];
      return `We hope you can join us, ${guestList}, and ${lastGuest}!`;
    }
  };
  

  const handleRSVPChange = (fullName, newRsvpStatus) => {
    setShowSuccess(false);
    setErrorMessage("");

    setAttendingCount((prevCount) => {
      const isCurrentlyYes = memberRSVPs[fullName] === true;
      if (newRsvpStatus === true && !isCurrentlyYes) {
        return prevCount + 1;
      }
      if (newRsvpStatus === false && isCurrentlyYes) {
        return Math.max(prevCount - 1, 0);
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
      const response = await fetch(`${API_URL}/rsvp`, {
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
        alert("Something went wrong. If you continue having issues please reach out to Ryan or Brenna!");
      }
    } catch (error) {
      console.error("Error sending RSVP:", error);
      alert("Something went wrong. If you continue having issues please reach out to Ryan or Brenna!");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateSuccessMessage = (rsvpData) => {
    const attendingGuests = Object.keys(rsvpData).filter(
      (guestName) => rsvpData[guestName] === true
    );

    const attendingFirstNames = attendingGuests.map((fullName) =>
      fullName.split(" ")[0]
    );

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

  const handlePartyCodeSubmit = async (event) => {
    event.preventDefault();
    if (!inputPartyCode) return;

    try {
      const response = await fetch(`${API_URL}/partyData/${inputPartyCode}`);
      if (response.ok) {
        const data = await response.json();
        if (data[inputPartyCode]) {
          navigate(`/rsvp/${inputPartyCode}`);
        } else {
          setInvalidCodeError("Invalid party code. Please check your email for your code.");
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
      

          {/* from portfolio */}
          <div class="hero-section-wrapper">
  <div class="hero-section">
  {/* {party.photos && party.photos.length > 0 ? (
  <img src={party.photos[0]} alt="First Party Photo" />
) : (
  <img src="/jan2024.jpg" alt="Default Image" /> // Provide a fallback
)} */}

  {/* <img src="/jan2024.jpg" alt="Desktop View"  /> */}

  <div className="image-container-rsvp">
      {/* <img src="/engagement-mobile.jpg" alt="Mobile View" className="mobile-image" /> */}
  <img src="/jan2024.jpg" alt="Desktop View" className="jan-img" />
  <img src="/guest-ill3.png" alt="Guest Illustration" className="guest-illustration-rsvp" />
</div>

    <header>
      <div class="intro">
      {/* <p class="overline">We're so excited!!!</p> */}
        
      
            <div className="guest-note-card">
              {party.note && (
                <div >
                  <h1>{generateGreeting(party.members)}</h1>
                  <div className="party-note">
                    <p>{party.note}</p>
                  </div>
                  <p>Love,</p>
                  <p>Ryan and Brenna</p>
                </div>
              )}
            </div>
  
            {Object.values(memberRSVPs).some((rsvp) => rsvp !== null) && (
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
      </div>
    </header>
  </div>
</div>
  
          {/* FAQ remains outside the colored background */}
          <div className="content-section">
            <p className="overline">Please let us know who's coming:</p>

          

            {/* 
            {party.photos && party.photos.length > 1 && (
  <Masonry
    breakpointCols={breakpointColumns}
    className="party-image-container"
    columnClassName="party-masonry-column"
  >
    {party.photos.slice(1).map((photo, index) => (
      <img
        key={index}
        src={photo}
        alt={`Party photo ${index + 2}`} // Adjust index since we're skipping the first
        className="party-images"
      />
    ))}
  </Masonry>
)}
 */}

{party.members && (
                <ul className="guest-list">
                  {party.members.map((member, index) => {
                    const fullName = `${member.first_name} ${member.last_name}`;
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
                              <strong>{fullName}</strong>
                            </div>
                            <div className="chip-container">
                              <button
                                className={`chip ${
                                  memberRSVPs[fullName] === true ? "active" : ""
                                }`}
                                onClick={() => handleRSVPChange(fullName, true)}
                              >
                                Will be attending
                              </button>
                              <button
                                className={`chip ${
                                  memberRSVPs[fullName] === false ? "active" : ""
                                }`}
                                onClick={() => handleRSVPChange(fullName, false)}
                              >
                                Sadly cannot attend
                              </button>
                            </div>
                            {memberRSVPs[fullName] === true && (
                              <div className="allergy-container">
                                <textarea
                                  id={`${fullName}-allergies`}
                                  className="input-textarea"
                                  value={memberAllergies[fullName]}
                                  onChange={(e) =>
                                    handleAllergyChange(fullName, e.target.value)
                                  }
                                  placeholder="Please let us know about any dietary restrictions"
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

<p className="overline">We love our memories with you!</p>

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

          <FAQ />
          </div>
        </>
      )}
    </div>
  );
}  

export default RSVP;
