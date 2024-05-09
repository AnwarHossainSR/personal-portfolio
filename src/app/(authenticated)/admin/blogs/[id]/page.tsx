'use client';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const UpdateBlogPage = ({ id }: { id: string }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>Update Blog Page of {id}</AdminLayout>
    </MainLayout>
  );
};

export default UpdateBlogPage;
