/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-console */

'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import BlogTable from '@/components/Table/BlogTable';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [posts, setPosts] = useState([]);
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      console.log(error);
      setPosts([]);
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
          <h1>Welcome to the Admin Blog Page</h1>
          <Link href="/admin/blogs/create" type="button" className="add-btn">
            Add Post
          </Link>
        </div>
        <BlogTable posts={posts} />
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
