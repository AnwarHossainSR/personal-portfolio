/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import AdminBlogCard from '@/components/Card/AdminBlogCard';
import Loader from '@/components/common/Loader';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setPosts(data.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setPosts([]);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  console.log('posts?.length', posts?.length);
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        {loading && <Loader text="Fetching..." />}
        {!loading && (
          <div
            className="flex justify-between items-center mb-5 w-full" // Use w-full
          >
            <h1 className="text-white text-2xl">
              {posts?.length > 0
                ? `Posts found ${posts?.length}`
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
        {!loading && <AdminBlogCard posts={posts} />}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
