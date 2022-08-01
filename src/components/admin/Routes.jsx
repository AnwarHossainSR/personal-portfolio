import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from '../../pages/admin';

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path='/admin'>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
