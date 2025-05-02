import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout'; // Import the Layout component
import HomePage from './HomePage';
import RSVP from './RSVP';
import FAQ from './FAQ';
import FAQContainer from './FAQContainer';
import Gifts from './Gifts';

import PartyTable from './PartyTable'; // Import the PartyTable component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} /> {/* HomePage will be the default route */}
          <Route path="rsvp" element={<RSVP />} />
          <Route path="rsvp/:partyCode" element={<RSVP />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="gifts" element={<Gifts />} />
          <Route path="faq-container" element={<FAQContainer />} />
          <Route path="party-table" element={<PartyTable />} /> {/* Add a route for PartyTable */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

