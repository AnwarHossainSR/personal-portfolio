'use client';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const CreateBlog = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>Create Blog Page</AdminLayout>
    </MainLayout>
  );
};

export default CreateBlog;
