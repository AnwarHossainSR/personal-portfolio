import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        navigate('/admin/login');
      } else {
        // save user
      }
    };
    checkAuth();
  }, [navigate]);
  return (
    <>
      <Outlet />
    </>
  );
};

export default AdminLayout;
