import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import RSVP from './RSVP';
import FAQ from './FAQ';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Dynamic route for RSVP with a party code */}
        <Route path="/rsvp/:partyCode" element={<RSVP />} />
        {/* Fallback for RSVP page without a party code */}
        <Route path="/rsvp" element={<RSVP />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
