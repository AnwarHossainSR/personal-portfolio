/* eslint-disable react/no-danger */
/* eslint-disable react/button-has-type */
/* eslint-disable no-console */

'use client';

import dynamic from 'next/dynamic';
import type { ChangeEvent } from 'react';
import { useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { formats, modules } from '@/lib/editor';
import { useTheme } from '@/providers/context/Context';

const CreateBlog = () => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const theme = useTheme();
  const { darkMode } = theme.state;

  const [formData, setFormData] = useState<any>({
    title: '',
    content: '',
    category: '',
    published: false,
    file: null,
  });

  const [selectedTab, setSelectedTab] = useState<'editor' | 'preview'>(
    'editor'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prevState: any) => ({
        ...prevState,
        [name]: (e.target as HTMLInputElement).checked, // type assertion to HTMLInputElement
      }));
    } else if (type === 'file') {
      const { files } = e.target as HTMLInputElement; // type assertion to HTMLInputElement
      if (files && files.length > 0) {
        setFormData((prevState: any) => ({
          ...prevState,
          [name]: files[0],
        }));
      }
    } else {
      setFormData((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleEditorChange = (value: string) => {
    setFormData((prevState: any) => ({
      ...prevState,
      content: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formDataToSend = new FormData();
    console.log('formData ', formData);
    formDataToSend.append('title', formData.title);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('published', formData.published);
    formDataToSend.append('file', formData.file);

    try {
      console.log('entering');
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        console.log('API Response:', result);
        setError(result.message);
        return;
      }

      // Reset form data
      setFormData({
        title: '',
        content: '',
        category: '',
        published: false,
        file: null,
      });
      setSuccess('Blog created successfully!');
    } catch (err: any) {
      console.log('err >>> ', err);
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className={`admin_blog__create ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="admin_blog__title">Create Blog</h2>
          <div className="tab-buttons">
            <button
              className={`tab-button ${selectedTab === 'editor' ? 'active' : ''}`}
              onClick={() => setSelectedTab('editor')}
            >
              Editor
            </button>
            <button
              className={`tab-button ${selectedTab === 'preview' ? 'active' : ''}`}
              onClick={() => setSelectedTab('preview')}
            >
              Preview
            </button>
          </div>
          {selectedTab === 'editor' && (
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
                <label htmlFor="file" className="admin_blog__label">
                  Image:
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
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
                  placeholder="Write your thoughts!"
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
              <button
                type="submit"
                className="admin_blog__submit-btn"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Create'}
              </button>
              {error && <p className="error">{error}</p>}
              {success && <p className="success">{success}</p>}
            </form>
          )}
          {selectedTab === 'preview' && (
            <div className="admin_blog__preview">
              <h2 className="admin_blog__preview-title">{formData.title}</h2>
              <p className="admin_blog__preview-category">
                {formData.category}
              </p>
              <div
                className="admin_blog__preview-content"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          )}
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default CreateBlog;
