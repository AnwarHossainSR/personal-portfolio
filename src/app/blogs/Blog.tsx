/* eslint-disable no-nested-ternary */

'use client';

/* eslint-disable react/no-array-index-key */

import { useEffect, useState } from 'react';

import BlogCard from '@/components/Card/BlogCard';
import Tab from '@/components/Tab';
import { QUERY_KEY } from '@/config/query-key';
import { useFetch } from '@/hooks/useAPiCall';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';
import { getCategories } from '@/services/categories';
import { getPosts } from '@/services/posts';

const Blogs = () => {
  const {
    data: posts,
    isLoading: isLoadingPosts,
    isError: isErrorPosts,
  } = useFetch([QUERY_KEY.POSTS], getPosts);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
  } = useFetch([QUERY_KEY.CATEGORIES], getCategories);

  const theme = useTheme();
  const { darkMode } = theme.state;
  const [filter, setFilter] = useState('All');

  useEffect(() => {
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
          {isLoadingCategories && <p>Loading categories...</p>}
          {isErrorCategories && (
            <p className="text-red-500">{isErrorCategories}</p>
          )}
          {!isLoadingCategories && !isErrorCategories && (
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
        {isLoadingPosts ? (
          <p>Loading...</p>
        ) : isErrorPosts ? (
          <p className="text-red-500">{isErrorPosts}</p>
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
