'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AdminCategoryCard from '@/components/Card/AdminCategoryCard';
import Loader from '@/components/common/Loader';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const AdminCategoryPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setCategories([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = (id: number) => {
    console.log('Delete Category', id);
    // Implement delete logic here
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {loading && <Loader text="Fetching Categories..." />}
        {!loading && (
          <>
            <div
              className="flex justify-between items-center mb-5"
              style={{
                width: '100%',
              }}
            >
              <h1 className="text-white text-2xl">
                {categories?.length > 0
                  ? `Categories found: ${categories?.length}`
                  : 'No Categories Found'}
              </h1>
              <Link
                href="/admin/categories/create"
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded transition-opacity hover:opacity-80 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Add Category
              </Link>
            </div>
            <AdminCategoryCard
              categories={categories}
              onDelete={handleDelete}
            />
          </>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminCategoryPage;
