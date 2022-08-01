import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../app/Footer';
import Navbar from '../app/Navbar';

const AppLayout = ({ darkMode }) => {
  return (
    <>
      <Navbar darkMode={darkMode} />
      <Outlet />
      <Footer />
    </>
  );
};

export default AppLayout;
