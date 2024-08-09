'use client';

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-danger */
/* eslint-disable react/button-has-type */

import dynamic from 'next/dynamic';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      const { data } = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        setError(data.message);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.file) {
      const fileURL = URL.createObjectURL(formData.file);
      setImagePreview(fileURL);

      // Cleanup URL object when the component unmounts or the file changes
      return () => {
        URL.revokeObjectURL(fileURL);
      };
    }
    setImagePreview(null);
    return () => {};
  }, [formData.file]);

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
    formDataToSend.append('title', formData.title);
    formDataToSend.append('short_content', formData.short_content);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('published', formData.published);
    formDataToSend.append('file', formData.file);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        setError(result.message);
        return;
      }

      // Reset form data
      setFormData({
        title: '',
        short_content: '',
        content: '',
        category: '',
        published: false,
        file: null,
      });
      setSuccess('Blog created successfully!');
      setImagePreview(null);
    } catch (err: any) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className={`p-4 ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="text-2xl mb-4 text-center text-gray-800 dark:text-gray-200">
            Create Blog
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
                  value={formData.title}
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
                  value={formData.short_content}
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
                  value={formData.category}
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
              </div>
              <div className="flex flex-col">
                <label
                  htmlFor="content"
                  className="text-gray-800 dark:text-gray-200"
                >
                  Content:
                </label>
                <ReactQuill
                  value={formData.content}
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
                  className="form-checkbox text-blue-600"
                  checked={formData.published}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Create'}
              </button>
              {error && <p className="text-red-500">{error}</p>}
              {success && <p className="text-green-500">{success}</p>}
            </form>
          )}
          {selectedTab === 'preview' && (
            <div className="bg-transparent p-4 rounded-lg">
              <h2 className="text-2xl mb-4">{formData.title}</h2>
              <p className="text-lg text-gray-600 mb-4">{formData.category}</p>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mb-4 max-w-full h-auto"
                />
              )}
              <div
                className="text-base leading-relaxed"
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
