import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../pages/admin';
import AddPortfolio from './Portfolio/AddPortfolio';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/admin'>
        <Route index element={<Dashboard />} />
        <Route path='add-portfolio' element={<AddPortfolio />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
