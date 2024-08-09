/* eslint-disable no-nested-ternary */

'use client';

/* eslint-disable react/no-array-index-key */

import { useEffect, useState } from 'react';

import BlogCard from '@/components/Card/BlogCard';
import Tab from '@/components/Tab';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const Blogs = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [filter, setFilter] = useState('All');
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blogs');
      if (!res.ok) {
        throw new Error('Failed to fetch posts');
      }
      const data = await res.json();
      setPosts(data.data); // Assuming the data is in `data.data`

      const res2 = await fetch('/api/categories');
      if (!res2.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data2 = await res2.json();
      setCategories(data2.data);
    } catch (err: any) {
      // eslint-disable-next-line no-console
      console.error(err);
      setError('Failed to load blogs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    window.scrollTo(0, 0);
  }, []);

  return (
    <MainLayout>
      <div className="portfolio-page__header">
        <p
          className="portfolio-page__header--text"
          style={{
            color: darkMode ? 'white' : '',
          }}
        >
          Some of my recent blogs.
        </p>
        <div
          className="portfolio-page__header--filter"
          style={{
            marginBottom: '2rem',
          }}
        >
          {!loading && (
            <Tab
              key="All"
              className={`${filter === 'All' ? 'active' : ''}`}
              text="All"
              handleEvent={() => setFilter('All')}
            />
          )}

          {categories?.length > 0 &&
            categories?.map((category: any) => (
              <Tab
                key={category._id}
                className={`${filter === category.name ? 'active' : ''}`}
                text={category.name}
                handleEvent={() => setFilter(category.name)}
              />
            ))}
        </div>
      </div>

      <div className="blogs">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : posts.length > 0 ? (
          posts.map((post: any) => (
            <BlogCard key={post._id} post={post} darkMode={darkMode} />
          ))
        ) : (
          <p>No blogs found for the selected tag.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default Blogs;
