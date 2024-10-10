import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Import the Layout component
import HomePage from './HomePage';
import RSVP from './RSVP';
import FAQ from './FAQ';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* HomePage will be the default route */}
          <Route path="rsvp" element={<RSVP />} />
          <Route path="rsvp/:partyCode" element={<RSVP />} />
          <Route path="faq" element={<FAQ />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
