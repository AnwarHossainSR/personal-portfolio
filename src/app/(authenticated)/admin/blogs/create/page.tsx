/* eslint-disable jsx-a11y/img-redundant-alt */

'use client';

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-danger */
/* eslint-disable react/button-has-type */

import dynamic from 'next/dynamic';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import { QUERY_KEY } from '@/config/query-key';
import { useFetch, usePost } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { formats, modules } from '@/lib/editor';
import { useTheme } from '@/providers/context/Context';
import { getCategories } from '@/services/categories';
import { createPost } from '@/services/posts';

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

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch categories using useFetch hook
  const { data: categories } = useFetch([QUERY_KEY.CATEGORIES], getCategories);

  // Use the usePost hook for form submission
  const {
    mutate: createBlog,
    // @ts-ignore
    isLoading: isSubmitting,
    error: submitError,
    isSuccess,
  } = usePost(data => createPost(data)); // Use createPost method

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

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('short_content', formData.short_content);
    formDataToSend.append('content', formData.content);
    formDataToSend.append('category', formData.category);
    formDataToSend.append('published', formData.published);
    formDataToSend.append('file', formData.file);

    createBlog(formDataToSend);

    if (isSuccess) {
      setFormData({
        title: '',
        short_content: '',
        content: '',
        category: '',
        published: false,
        file: null,
      });
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
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Create'}
              </button>
              {submitError && (
                <p className="text-red-500">{submitError.message}</p>
              )}
              {isSuccess && (
                <p className="text-green-500">Blog created successfully!</p>
              )}
            </form>
          )}
          {selectedTab === 'preview' && (
            <div className="bg-transparent p-4 rounded-lg">
              <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
                {formData.title}
              </h2>
              <p className="mb-4 text-gray-800 dark:text-gray-200">
                {formData.short_content}
              </p>
              <p
                className="content text-gray-800 dark:text-gray-200"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
              {imagePreview && (
                <div className="mt-4">
                  <img
                    src={imagePreview}
                    alt="Selected Image"
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default CreateBlog;
