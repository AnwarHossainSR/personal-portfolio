'use client';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const AdminPortfolioPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <h1>Welcome to the Admin Portfolio Page</h1>
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminPortfolioPage;
