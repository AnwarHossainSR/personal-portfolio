'use client';

import BlogTable from '@/components/Table/BlogTable';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { useEffect, useState } from 'react';

const AdminBlogPage = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [posts, setPosts] = useState([])
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      const data = await res.json();
      setPosts(data.data);
    } catch (error) {
      console.log(error)
      setPosts([])
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [])

  console.log(posts);
  
  
  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <h1>Welcome to the Admin Blog Page</h1>
        <BlogTable posts={posts} />
      </AdminLayout>
    </MainLayout>
  );
};

export default AdminBlogPage;
