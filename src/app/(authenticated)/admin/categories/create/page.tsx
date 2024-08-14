'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { usePost } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { createCategory } from '@/services/categories';

const CategoryFormCreatePage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');

  const {
    mutate: categoryCreate,
    // @ts-ignore
    isLoading: isSubmitting,
    error: submitError,
    isSuccess,
  } = usePost(data => createCategory(data));

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('color', color);
      categoryCreate(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      router.push('/admin/categories');
    }
    if (submitError) {
      console.log(submitError);
    }
  }, [isSuccess]);

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className="max-w-lg mx-auto p-5 bg-gray-800 rounded">
          <h1 className="text-2xl mb-5">Add Category</h1>
          <div className="mb-5">
            <label htmlFor="name" className="block text-white mb-2">
              Category Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="mb-5">
            <label htmlFor="name" className="block text-white mb-2">
              Background Color
            </label>
            <input
              type="text"
              id="color"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white"
              value={color}
              onChange={e => setColor(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="px-4 py-2 bg-blue-500 text-white rounded transition-opacity hover:opacity-80"
            onClick={handleSave}
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </button>
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default CategoryFormCreatePage;
