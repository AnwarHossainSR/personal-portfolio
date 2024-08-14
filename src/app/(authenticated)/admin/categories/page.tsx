'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import AdminCategoryCard from '@/components/Card/AdminCategoryCard';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useFetch } from '@/hooks/useAPiCall';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { getCategories } from '@/services/categories';

const AdminCategoryPage = () => {
  const theme = useTheme();
  const { isOpen, options, confirm, setIsOpen } = useConfirmationDialog();

  const { darkMode } = theme.state;
  const {
    data: categories,
    isLoading,
    isError,
    refetch: refetchCategoryData,
  } = useFetch([QUERY_KEY.CATEGORIES], getCategories);

  useEffect(() => {
    if (isError) {
      console.log(isError);
    }
    refetchCategoryData();
  }, [isError]);

  const handleDelete = async (id: number) => {
    console.log('Delete Category', id);
    confirm({
      title: 'Delete Item?',
      message: 'This action cannot be undone!',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
      onConfirm: () => {
        // Perform the delete action
        console.log('Item deleted');
      },
      onCancel: () => {
        console.log('Delete action canceled');
      },
    });
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isLoading && <Loader text="Fetching..." />}
        {!isLoading && (
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
        <ConfirmationDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          title={options.title}
          message={options.message}
          confirmButtonText={options.confirmButtonText}
          cancelButtonText={options.cancelButtonText}
          onConfirm={options.onConfirm}
          onCancel={options.onCancel}
        />
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminCategoryPage;
