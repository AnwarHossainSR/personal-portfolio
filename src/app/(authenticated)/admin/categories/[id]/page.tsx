'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const CategoryFormEditPage = ({ params }: { params: { id: string } }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCategory = async () => {
    if (params.id) {
      try {
        const res = await fetch(`/api/categories/${params.id}`);
        const data = await res.json();
        setName(data.data.name);
        setColor(data.data.color);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, [params.id]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('color', color);
      formData.append('id', params.id);
      await fetch(`/api/categories/${params.id}`, {
        method: 'PUT',
        body: formData,
      });
      router.push('/admin/categories');
    } catch (error) {
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
            <h1 className="text-2xl mb-5">Edit Category</h1>
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
              Update
            </button>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default CategoryFormEditPage;
