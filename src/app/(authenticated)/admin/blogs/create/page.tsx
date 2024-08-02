/* eslint-disable no-console */

'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { formats, modules } from '@/lib/editor';
import { useTheme } from '@/providers/context/Context';

const CreateBlog = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    published: false,
    image: null,
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prevState => ({
        ...prevState,
        [name]: (e.target as HTMLInputElement).checked, // type assertion to HTMLInputElement
      }));
    } else if (type === 'file') {
      const { files } = e.target as HTMLInputElement; // type assertion to HTMLInputElement
      if (files && files.length > 0) {
        setFormData(prevState => ({
          ...prevState,
          [name]: files[0],
        }));
      }
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEditorChange = (value: string) => {
    setFormData(prevState => ({
      ...prevState,
      content: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    // Reset form data
    setFormData({
      title: '',
      content: '',
      category: '',
      published: false,
      image: null,
    });
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className={`admin_blog__create ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="admin_blog__title">Create Blog</h2>
          <form className="admin_blog__form" onSubmit={handleSubmit}>
            <div className="admin_blog__form-group">
              <label htmlFor="title" className="admin_blog__label">
                Title:
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className={`admin_blog__input ${darkMode ? 'dark-mode' : ''}`}
                value={formData.title}
                onChange={handleChange}
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
                name="category"
                className={`admin_blog__input ${darkMode ? 'dark-mode' : ''}`}
                value={formData.category}
                onChange={handleChange}
                required
              />
            </div>
            <div className="admin_blog__form-group">
              <label htmlFor="image" className="admin_blog__label">
                Image:
              </label>
              <input
                type="file"
                id="image"
                name="image"
                className={`admin_blog__file-input ${darkMode ? 'dark-mode' : ''}`}
                accept="image/*"
                onChange={handleChange}
              />
            </div>
            <div className="admin_blog__form-group">
              <label htmlFor="content" className="admin_blog__label">
                Content:
              </label>
              <ReactQuill
                value={formData.content}
                onChange={handleEditorChange}
                modules={modules}
                formats={formats}
                className={`admin_blog__editor ${darkMode ? 'dark-mode' : ''}`}
              />
            </div>
            <div className="admin_blog__form-group checkbox-div">
              <label className="admin_blog__label">Published:</label>
              <input
                type="checkbox"
                id="published"
                name="published"
                className={`admin_blog__checkbox ${darkMode ? 'dark-mode' : ''}`}
                checked={formData.published}
                onChange={handleChange}
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
