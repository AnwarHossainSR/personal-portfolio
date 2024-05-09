/* eslint-disable no-console */

'use client';

import { useState } from 'react';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { useTheme } from '@/providers/context/Context';

const CreateBlog = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [image, setImage] = useState(null);

  const handleTitleChange = (e: any) => {
    setTitle(e.target.value);
  };

  const handleCategoryChange = (e: any) => {
    setCategory(e.target.value);
  };

  const handlePublishedChange = (e: any) => {
    setPublished(e.target.checked);
  };

  const handleImageChange = (e: any) => {
    // Assuming only one image is selected
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Add logic to handle form submission (e.g., sending data to backend)
    console.log('Title:', title);
    console.log('Content:', content);
    console.log('Category:', category);
    console.log('Published:', published);
    console.log('Image:', image);
    // Clear form fields
    setTitle('');
    setContent('');
    setCategory('');
    setPublished(false);
    setImage(null);
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className="admin_blog__create">
          <h2 className="admin_blog__title">Create Blog</h2>
          <form className="admin_blog__form" onSubmit={handleSubmit}>
            <div className="admin_blog__form-group">
              <label htmlFor="title" className="admin_blog__label">
                Title:
              </label>
              <input
                type="text"
                id="title"
                className="admin_blog__input"
                value={title}
                onChange={handleTitleChange}
                required
              />
            </div>
            <div className="admin_blog__form-group">
              <label htmlFor="category" className="admin_blog__label">
                Category:
              </label>
              <input
                type="text"
                id="category"
                className="admin_blog__input"
                value={category}
                onChange={handleCategoryChange}
                required
              />
            </div>
            <div className="admin_blog__form-group">
              <label className="admin_blog__label">Published:</label>
              <input
                type="checkbox"
                className="admin_blog__checkbox"
                checked={published}
                onChange={handlePublishedChange}
              />
            </div>
            <div className="admin_blog__form-group">
              <label htmlFor="image" className="admin_blog__label">
                Image:
              </label>
              <input
                type="file"
                id="image"
                className="admin_blog__file-input"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <button type="submit" className="admin_blog__submit-btn">
              Create
            </button>
          </form>
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default CreateBlog;
