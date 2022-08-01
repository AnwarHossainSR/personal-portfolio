import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Routes from '../admin/Routes';

import Sidebar from '../admin/Sidebar';
import TopNav from '../admin/TopNav';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) navigate('/login');
    };
    checkAuth();
  }, [navigate]);
  return (
    <div className='layout'>
      <Sidebar location={location} navigate={navigate} />
      <div className='layout__content'>
        <TopNav />
        <div className='layout__content-main'>
          <Routes />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
