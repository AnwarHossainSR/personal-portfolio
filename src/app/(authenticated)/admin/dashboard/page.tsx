'use client';

import StateCard from '@/components/Card/StateCard';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const Dashboard = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <h1>Welcome to the Dashboard</h1>
        <div className="stats-cards">
          <StateCard darkMode={darkMode} />
          <StateCard darkMode={darkMode} />
          <StateCard darkMode={darkMode} />
          <StateCard darkMode={darkMode} />
          <StateCard darkMode={darkMode} />
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default Dashboard;
