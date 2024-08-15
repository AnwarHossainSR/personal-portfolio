'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAlert } from '@/hooks/useAlert';
import { useFetch, usePut } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { getCAtegoryDetails, updateCategory } from '@/services/categories';

const CategoryFormEditPage = ({ params }: { params: { id: string } }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const router = useRouter();
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const { showAlert } = useAlert();

  const { data, isLoading, isError, isSuccess } = useFetch(
    [`blogDetails-${params.id}`],
    () => getCAtegoryDetails(params.id)
  );
  const {
    mutate: categoryUpdate,
    // @ts-ignore
    isLoading: isSubmitting,
    error: submitError,
    isSuccess: isUpdated,
  } = usePut(updatedData => updateCategory(params.id, updatedData));

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('color', color);
      formData.append('id', params.id);
      categoryUpdate(formData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isError || submitError) {
      showAlert({
        message: 'An error occurred while updating the category.',
        type: 'error',
        duration: 3000,
      });
      console.log('isError >>', isError);
      console.log('submitError >>', submitError);
    }
    if (isSuccess) {
      setName(data?.name);
      setColor(data?.color);
    }
    if (isUpdated) {
      showAlert({
        message: 'Category updated successfully!',
        type: 'success',
        duration: 3000,
      });
      router.push('/admin/categories');
    }
  }, [isError, isSuccess, isUpdated]);

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isLoading ? (
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
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default CategoryFormEditPage;
