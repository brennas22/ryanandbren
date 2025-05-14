import React, { useEffect } from 'react';
import './FAQ.css'; // Import your CSS file
import FAQ from "./FAQ";


function FAQContainer() {
 

  return (
    <div className="outer-container">
        
      <FAQ />
      <div className="faq-container">
            <p className="overline">Help, I'm lost!</p>
            <h4>I found my way to this page but I can't find my party code</h4>
            <p>Oh no! Your party code should be in the email invitation, but if for some reason you can't locate it just shoot one of us a text!</p>
        </div>
    </div>
  );
}

export default FAQContainer;