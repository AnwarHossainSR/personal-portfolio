'use client';

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

import { getDateCompare } from '@/lib';

const AdminBlogCard = ({ posts }: { posts: any }) => {
  const onDelete = (id: number) => {
    console.log('Delete Post', id);
  };

  return (
    <div className="flex flex-wrap gap-6 justify-items-start">
      {posts.map((post: any) => (
        <div
          key={post._id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-80 p-5 transition-transform transform hover:scale-105"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              {post.title}
            </h2>
            <p className="text-gray-400 mb-2">
              By <span className="text-gray-200">{post.author.name}</span> on{' '}
              {getDateCompare(post.createdAt)}
            </p>
            <p className="text-gray-400">
              Category:{' '}
              <span className="text-gray-200">
                {post.category ?? 'No Category'}
              </span>
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Link
              href={`/admin/blogs/${post?._id}`}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-full transition-transform transform hover:scale-110"
              title="Edit Post"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>
            <button
              type="button"
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-full transition-transform transform hover:scale-110"
              onClick={() => onDelete(post._id)}
              title="Delete Post"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminBlogCard;
