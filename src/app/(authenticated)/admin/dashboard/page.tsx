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
        <h1 className="text-2xl mb-5">Welcome to the Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
