'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const CategoryFormCreatePage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, color }),
      });
      setLoading(false);
      router.push('/admin/categories');
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {loading ? (
          <div>Loading...</div>
        ) : (
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
              Save
            </button>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default CategoryFormCreatePage;
