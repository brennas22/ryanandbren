import React from 'react';
import Navbar from './Navbar'; // Import the Navbar component
import { Outlet } from 'react-router-dom'; // Outlet will render the matched child route

function Layout() {
  return (
    <div>
      <Navbar />
      <main>
        <Outlet /> {/* This is where the child routes (pages) will be rendered */}
      </main>
    </div>
  );
}

export default Layout;
