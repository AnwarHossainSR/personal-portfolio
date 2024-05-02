'use client';

/* eslint-disable react/no-array-index-key */

import { useEffect, useState } from 'react';

import BlogCard from '@/components/Card/BlogCard';
import Tab from '@/components/Tab';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { blogTags } from '@/lib/const';
import { useTheme } from '@/providers/context/Context';

const Blogs = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [filter, setFilter] = useState('all');

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
          {blogTags.map((tag, index) => (
            <Tab
              key={index}
              className={`${filter === tag.name ? 'active' : ''}`}
              text={tag.name}
              handleEvent={() => setFilter(tag.name)}
            />
          ))}
        </div>
      </div>
      <div className="blogs">
        {[...Array(10)].map((_, index) => (
          <BlogCard key={index} darkMode={darkMode} />
        ))}
      </div>
    </MainLayout>
  );
};

export default Blogs;
