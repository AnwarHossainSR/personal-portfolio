'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import AdminCategoryCard from '@/components/Card/AdminCategoryCard';
import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useAlert } from '@/hooks/useAlert';
import { useDelete, useFetch } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { useNotificationContext } from '@/providers/context/NotificationProvider';
import { deleteCategory, getCategories } from '@/services/categories';

const AdminCategoryPage = () => {
  const theme = useTheme();
  const { showConfirmation } = useNotificationContext();
  const { showAlert } = useAlert();

  const { darkMode } = theme.state;
  const {
    data: categories,
    isLoading: isFetching,
    isError,
    refetch: refetchCategoryData,
  } = useFetch([QUERY_KEY.CATEGORIES], getCategories);

  const { remove } = useDelete(deleteCategory, {
    onSuccess: () => {
      refetchCategoryData(); // Refresh categories after deletion
      showAlert({
        message: 'Category deleted successfully!',
        type: 'success',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      showAlert({
        message: 'An error occurred while deleting the category.',
        type: 'error',
        duration: 3000,
      });
      console.error('Error deleting category:', error);
    },
  });

  useEffect(() => {
    if (isError) {
      console.log(isError);
    }
    refetchCategoryData();
  }, [isError]);

  const handleDelete = async (id: number) => {
    showConfirmation({
      onConfirm: () => remove(id), // Call the remove function with the category id
      onCancel: () => {
        console.log('Delete action canceled');
      },
    });
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isFetching && <Loader text="Processing..." />}
        {!isFetching && (
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
