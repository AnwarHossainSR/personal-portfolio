/* eslint-disable jsx-a11y/img-redundant-alt */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-danger */
/* eslint-disable react/button-has-type */

'use client';

import dynamic from 'next/dynamic';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { formats, modules } from '@/lib/editor';
import { useTheme } from '@/providers/context/Context';

const EditBlog = ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const theme = useTheme();
  const { darkMode } = theme.state;

  const [formData, setFormData] = useState<any>({
    title: '',
    short_content: '',
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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/blogs/${slug}`);
      const { data } = await response.json();
      if (response.ok) {
        setFormData({
          title: data.title || '',
          short_content: data.short_content || '',
          content: data.content || '',
          category: data.category || '',
          published: data.published || false,
          file: null,
        });
        setImagePreview(data.image_url || null);
      } else {
        setError(data.message || 'Failed to load blog data');
      }
      const response2 = await fetch('/api/categories');
      const { data: cats } = await response2.json();
      if (response2.ok) {
        setCategories(cats);
      } else {
        setError('Failed to load categories');
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchData();
    }
  }, [slug]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData((prevState: any) => ({
        ...prevState,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === 'file') {
      const { files } = e.target as HTMLInputElement;
      if (files && files.length > 0) {
        setFormData((prevState: any) => ({
          ...prevState,
          [name]: files[0],
        }));
        const fileURL = URL.createObjectURL(files[0]);
        setImagePreview(fileURL);
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
    formDataToSend.append('title', formData.title);
    formDataToSend.append('short_content', formData.short_content);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('published', formData.published.toString());
    if (formData.file) {
      formDataToSend.append('file', formData.file);
    }

    try {
      const response = await fetch(`/api/blogs/${slug}`, {
        method: 'PUT',
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message);
        return;
      }

      setSuccess('Blog updated successfully!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className={`p-4 ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="text-2xl mb-4 text-center text-gray-800 dark:text-gray-200">
            Edit Blog
          </h2>
          <div className="flex mb-4">
            <button
              className={`${
                selectedTab === 'editor'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              } px-4 py-2 rounded-lg`}
              onClick={() => setSelectedTab('editor')}
            >
              Editor
            </button>
            <button
              className={`${
                selectedTab === 'preview'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800'
              } px-4 py-2 rounded-lg ml-2`}
              onClick={() => setSelectedTab('preview')}
            >
              Preview
            </button>
          </div>
          {selectedTab === 'editor' && (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label
                  htmlFor="title"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  value={formData.title || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="short_content"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Short Content:
                </label>
                <textarea
                  id="short_content"
                  name="short_content"
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  value={formData.short_content || ''}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="category"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Category:
                </label>
                <select
                  id="category"
                  name="category"
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  value={formData.category || ''}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a category</option>
                  {categories &&
                    categories.length > 0 &&
                    categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="file"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Image:
                </label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
                  accept="image/*"
                  onChange={handleChange}
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="mt-2 max-w-full h-auto rounded-lg"
                  />
                )}
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="content"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Content:
                </label>
                <ReactQuill
                  value={formData.content || ''}
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                  className="dark-mode"
                  placeholder="Write your thoughts!"
                />
              </div>
              <div className="flex items-center">
                <label
                  htmlFor="published"
                  className="text-gray-800 dark:text-gray-200 mr-2"
                >
                  Published:
                </label>
                <input
                  type="checkbox"
                  id="published"
                  name="published"
                  className="form-checkbox text-blue-500 h-5 w-5 dark:bg-gray-700 dark:border-gray-600"
                  checked={formData.published}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className={`${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600'
                } text-white font-bold py-2 px-4 rounded-lg`}
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Blog'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </form>
          )}
          {selectedTab === 'preview' && (
            <div className="p-4 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200">
              <h2 className="text-2xl font-bold mb-4">{formData.title}</h2>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview Image"
                  className="max-w-full h-auto mb-4 rounded-lg"
                />
              )}
              <p className="text-gray-800 dark:text-gray-200 mb-4">
                {formData.short_content}
              </p>
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            </div>
          )}
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default EditBlog;
