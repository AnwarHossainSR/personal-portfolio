/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */

'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import AdminBlogCard from '@/components/Card/AdminBlogCard';
import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useAlert } from '@/hooks/useAlert';
import { useDelete, useFetch } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { useNotificationContext } from '@/providers/context/NotificationProvider';
import { deletePost, getPosts } from '@/services/posts';

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const { showConfirmation } = useNotificationContext();
  const { showAlert } = useAlert();

  const {
    data: postsData,
    isLoading,
    isError,
    refetch,
  } = useFetch([QUERY_KEY.POSTS], getPosts);

  const { remove } = useDelete(deletePost, {
    onSuccess: () => {
      refetch(); // Refresh the posts data after deletion
      showAlert({
        message: 'Post deleted successfully!',
        type: 'success',
        duration: 3000,
      });
    },
    onError: (error: any) => {
      console.error('Error deleting post:', error);
      showAlert({
        message: 'An error occurred while deleting the post.',
        type: 'error',
        duration: 3000,
      });
    },
  });

  useEffect(() => {
    if (isError) {
      console.log('Error fetching posts');
    }
  }, [isError]);
  const handleDelete = async (id: number) => {
    showConfirmation({
      onConfirm: () => remove(id),
      onCancel: () => {
        console.log('Delete action canceled');
      },
    });
  };
  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isLoading && <Loader text="Processing..." />}
        {!isLoading && (
          <>
            <div className="flex justify-between items-center mb-5 w-full">
              <h1 className="text-white text-2xl">
                {postsData?.length > 0
                  ? `Posts found ${postsData?.length}`
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
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
