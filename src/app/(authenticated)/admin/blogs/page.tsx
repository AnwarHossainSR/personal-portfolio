/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AdminBlogCard from '@/components/Card/AdminBlogCard';
import Alert from '@/components/common/Alert';
import ConfirmationDialog from '@/components/common/ConfirmationDialog';
import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useDelete, useFetch } from '@/hooks/useAPiCall';
import { useConfirmationDialog } from '@/hooks/useConfirmationDialog';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { deletePost, getPosts } from '@/services/posts';

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const { isOpen, options, confirm, setIsOpen } = useConfirmationDialog();

  const {
    data: postsData,
    isLoading,
    isError,
    refetch,
  } = useFetch([QUERY_KEY.POSTS], getPosts);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>(
    'success'
  );

  const { remove } = useDelete(deletePost, {
    onSuccess: () => {
      refetch(); // Refresh the posts data after deletion
      setAlertMessage('Post deleted successfully!');
      setAlertType('success');
      setShowAlert(true);
    },
    onError: (error: any) => {
      console.error('Error deleting post:', error);
      setAlertMessage('Failed to delete the post.');
      setAlertType('error');
      setShowAlert(true);
    },
  });

  useEffect(() => {
    if (isError) {
      console.log('Error fetching posts');
    }
  }, [isError]);
  const handleDelete = async (id: number) => {
    confirm({
      onConfirm: () => remove(id), // Call the remove function with the category id
      onCancel: () => {
        console.log('Delete action canceled');
      },
    });
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isLoading && <Loader text="Processing..." />}
        {!isLoading && (
          <>
            <div className="flex justify-between items-center mb-5 w-full">
              <h1 className="text-white text-2xl">
                {postsData?.data?.length > 0
                  ? `Posts found ${postsData?.data?.length}`
                  : 'No posts Found'}
              </h1>
              <Link
                href="/admin/blogs/create"
                type="button"
                className="px-4 py-2 bg-blue-500 text-white rounded transition-opacity hover:opacity-80 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                Add Post
              </Link>
            </div>
            <AdminBlogCard posts={postsData} onDelete={handleDelete} />
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
        <Alert
          message={alertMessage}
          type={alertType}
          isVisible={showAlert}
          onClose={() => setShowAlert(false)}
        />
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
