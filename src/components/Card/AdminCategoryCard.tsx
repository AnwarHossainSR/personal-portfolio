'use client';

import Link from 'next/link';
import { FaEdit, FaTrash } from 'react-icons/fa';

const AdminCategoryCard = ({
  categories,
  onDelete,
}: {
  categories: any;
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: number) => void;
}) => {
  return (
    <div className="flex flex-wrap gap-6 justify-items-start">
      {categories?.map((category: any) => (
        <div
          key={category._id}
          className="bg-gray-800 rounded-lg shadow-lg overflow-hidden w-80 p-5 transition-transform transform hover:scale-105"
        >
          <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-3 text-white">
              {category.name}
            </h2>
            <p className="text-gray-400">
              Seleced color is {category.color ?? 'No color Available'}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <Link
              href={`/admin/categories/${category?._id}`}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-full transition-transform transform hover:scale-110"
              title="Edit Category"
            >
              <FaEdit className="mr-2" /> Edit
            </Link>
            <button
              type="button"
              className="flex items-center px-3 py-2 bg-red-600 text-white rounded-full transition-transform transform hover:scale-110"
              onClick={() => onDelete(category._id)}
              title="Delete Category"
            >
              <FaTrash className="mr-2" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminCategoryCard;
