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

  console.log(posts);

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className="blog_header">
          {!loading && (
            <>
              <h1>Welcome to the Admin Blog Page</h1>
              <Link
                href="/admin/blogs/create"
                type="button"
                className="add-btn"
              >
                Add Post
              </Link>
            </>
          )}
        </div>
        {loading && <Loader text="featching..." />}
        {!loading && <AdminBlogCard posts={posts} />}
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
