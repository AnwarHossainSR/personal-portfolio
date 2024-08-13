/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */

'use client';

import Link from 'next/link';
import { useEffect } from 'react';

import AdminBlogCard from '@/components/Card/AdminBlogCard';
import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useFetch } from '@/hooks/useAPiCall'; // Import useFetch hook
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const fetchPostsApi = async () => {
  const res = await fetch('/api/blogs');
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  return res.json();
};

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  const {
    data: postsData,
    isLoading,
    isError,
  } = useFetch([QUERY_KEY.POSTS], fetchPostsApi);

  useEffect(() => {
    if (isError) {
      console.log('Error fetching posts');
    }
  }, [isError]);

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {isLoading && <Loader text="Fetching..." />}
        {!isLoading && (
          <div
            className="flex justify-between items-center mb-5 w-full" // Use w-full
          >
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
        )}
        {!isLoading && postsData?.data && (
          <AdminBlogCard posts={postsData.data} />
        )}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
