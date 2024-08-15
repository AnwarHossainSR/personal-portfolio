/* eslint-disable no-nested-ternary */
/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-use-before-define */
/* eslint-disable import/order */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-danger */

'use client';

import { useRouter } from 'next/navigation';
import type { ChangeEvent } from 'react';
import { useEffect, useMemo, useState } from 'react';
import 'react-quill/dist/quill.snow.css';

import Loader from '@/components/common/Loader';
import { QUERY_KEY } from '@/config/query-key';
import { useFetch, usePut } from '@/hooks/useAPiCall';
import AdminLayout from '@/layouts/MainLayout/AdminLayout';
import MainLayout from '@/layouts/MainLayout/MainLayout';
import { formats, modules } from '@/lib/editor';
import { useTheme } from '@/providers/context/Context';
import { getCategories } from '@/services/categories';
import { getBlogDetails, updatePost } from '@/services/posts';
import dynamic from 'next/dynamic';

const EditBlog = ({ params: { slug } }: { params: { slug: string } }) => {
  const {
    state: { darkMode },
  } = useTheme();
  const [formData, setFormData] = useState({
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
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    data: blogData,
    isLoading: isBlogLoading,
    isError: isBlogError,
  } = useFetch([`blogDetails-${slug}`], () => getBlogDetails(slug));
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useFetch([QUERY_KEY.CATEGORIES], getCategories);

  const {
    mutate: postUpdate,
    // @ts-ignore
    isLoading: isSubmitLoading,
    error: isSubmitError,
    isSuccess,
  } = usePut(updatedData => updatePost(slug, updatedData));

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    // @ts-ignore
    const { name, value, type, files, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]:
        type === 'checkbox'
          ? checked
          : type === 'file' && files
            ? files[0]
            : value,
    }));

    if (type === 'file' && files && files.length > 0) {
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleEditorChange = (value: string) =>
    setFormData(prevState => ({ ...prevState, content: value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (value) {
        // @ts-ignore
        if (value instanceof File) {
          formDataToSend.append(key, value, value.name);
        } else {
          formDataToSend.append(key, value as string);
        }
      }
    });

    postUpdate(formDataToSend);
  };

  useEffect(() => {
    if (blogData) {
      console.log('blogData :', blogData);
      setFormData({
        title: blogData.title || '',
        short_content: blogData.short_content || '',
        content: blogData.content || '',
        category: blogData.category._id || '',
        published: blogData.published || false,
        file: null,
      });
      setImagePreview(blogData.image_url || null);
    }
  }, [blogData]);

  useEffect(() => {
    if (isSuccess) router.push('/admin/blogs');
    if (isSubmitError) console.log(isSubmitError);
  }, [isSuccess, isSubmitError]);

  if (isBlogLoading || isCategoriesLoading) return <Loader text="Loading..." />;
  if (isBlogError || isCategoriesError)
    return (
      <p className="text-red-500">Error: {isBlogError || isCategoriesError}</p>
    );

  return (
    <MainLayout>
      <AdminLayout darkMode={darkMode}>
        <div className={`p-4 ${darkMode ? 'dark-mode' : ''}`}>
          <h2 className="text-2xl mb-4 text-center text-gray-800 dark:text-gray-200">
            Edit Blog
          </h2>
          <div className="flex mb-4">
            {['editor', 'preview'].map(tab => (
              <button
                type="button"
                key={tab}
                className={`px-4 py-2 rounded-lg ${selectedTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} ml-2`}
                onClick={() => setSelectedTab(tab as 'editor' | 'preview')}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {selectedTab === 'editor' ? (
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <InputField
                label="Title:"
                id="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
              />
              <TextAreaField
                label="Short Content:"
                id="short_content"
                value={formData.short_content}
                onChange={handleChange}
              />
              <SelectField
                label="Category:"
                id="category"
                value={formData.category}
                onChange={handleChange}
                options={categories}
              />
              <FileInputField
                label="Image:"
                id="file"
                onChange={handleChange}
                imagePreview={imagePreview}
              />
              <EditorField
                label="Content:"
                value={formData.content}
                onChange={handleEditorChange}
              />
              <CheckboxField
                label="Published:"
                id="published"
                checked={formData.published}
                onChange={handleChange}
              />
              <SubmitButton isLoading={isSubmitLoading} />
            </form>
          ) : (
            <PreviewField
              title={formData.title}
              imagePreview={imagePreview}
              content={formData.content}
              shortContent={formData.short_content}
            />
          )}
        </div>
      </AdminLayout>
    </MainLayout>
  );
};

export default EditBlog;

const InputField = ({ label, id, type, value, onChange }: any) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
      required
    />
  </div>
);

const TextAreaField = ({ label, id, value, onChange }: any) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <textarea
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
      required
    />
  </div>
);

const SelectField = ({ label, id, value, onChange, options }: any) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <select
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
      required
    >
      <option value="">Select a category</option>
      {options &&
        options.length > 0 &&
        options.map((cat: any) => (
          <option key={cat._id} value={cat._id} selected={cat._id === value}>
            {cat.name}
          </option>
        ))}
    </select>
  </div>
);

const FileInputField = ({ label, id, onChange, imagePreview }: any) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="text-gray-800 dark:text-gray-200">
      {label}
    </label>
    <input
      type="file"
      id={id}
      name={id}
      className="p-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200"
      accept="image/*"
      onChange={onChange}
    />
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Image Preview"
        className="mt-2 max-w-full h-auto rounded-lg"
      />
    )}
  </div>
);

const EditorField = ({ label, value, onChange }: any) => {
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  return (
    <div className="flex flex-col">
      <label htmlFor="content" className="text-gray-800 dark:text-gray-200">
        {label}
      </label>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        className="dark-mode"
        placeholder="Write your thoughts!"
      />
    </div>
  );
};

const CheckboxField = ({ label, id, checked, onChange }: any) => (
  <div className="flex items-center">
    <label htmlFor={id} className="text-gray-800 dark:text-gray-200 mr-2">
      {label}
    </label>
    <input
      type="checkbox"
      id={id}
      name={id}
      checked={checked}
      onChange={onChange}
      className="form-checkbox text-blue-500"
    />
  </div>
);

const SubmitButton = ({ isLoading }: any) => {
  console.log(isLoading);
  return (
    <button
      type="submit"
      className={`px-4 py-2 rounded-lg text-white ${isLoading ? 'bg-gray-500' : 'bg-blue-500'} hover:bg-blue-600`}
      disabled={isLoading}
    >
      {isLoading ? 'Submitting...' : 'Submit'}
    </button>
  );
};

const PreviewField = ({ title, imagePreview, content, shortContent }: any) => (
  <div className="preview">
    <h1 className="text-3xl mb-4 text-gray-800 dark:text-gray-200">{title}</h1>
    {imagePreview && (
      <img
        src={imagePreview}
        alt="Image Preview"
        className="mb-4 max-w-full h-auto rounded-lg"
      />
    )}
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      className="mb-4 text-gray-800 dark:text-gray-200"
    />
    <p className="text-gray-800 dark:text-gray-200">{shortContent}</p>
  </div>
);
