import React from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import Navbar from '../Navbar';

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
