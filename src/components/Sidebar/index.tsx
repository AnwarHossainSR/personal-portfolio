/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FaBlog, FaBriefcase, FaTachometerAlt, FaTags } from 'react-icons/fa';

const Sidebar = ({ darkMode }: { darkMode: boolean }) => {
  const { push } = useRouter();
  const pathname = usePathname();

  const handleNavigate = (path: string) => {
    push(`/admin/${path}`);
  };

  const getMenuItemClass = (path: string) => {
    const baseClass = darkMode
      ? 'text-white hover:text-yellow-400'
      : 'text-gray-800 hover:text-yellow-700';

    const activeClass = darkMode
      ? 'bg-yellow-500 text-gray-800'
      : 'bg-gray-800 text-white';

    return pathname.includes(path) ? `${baseClass} ${activeClass}` : baseClass;
  };

  return (
    <div
      className={`p-5 w-52 ${
        darkMode
          ? 'bg-gray-800 text-white border-r border-gray-600'
          : 'bg-yellow-500 text-gray-800'
      }`}
    >
      <ul className="list-none p-0">
        <li
          role="button"
          tabIndex={0}
          className={`mb-2 cursor-pointer flex items-center ${getMenuItemClass(
            'dashboard'
          )} p-2 rounded`}
          onClick={() => handleNavigate('dashboard')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('dashboard');
            }
          }}
        >
          <FaTachometerAlt className="mr-2" />
          Dashboard
        </li>
        <li
          role="button"
          tabIndex={0}
          className={`mb-2 cursor-pointer flex items-center ${getMenuItemClass(
            'blogs'
          )} p-2 rounded`}
          onClick={() => handleNavigate('blogs')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('blogs');
            }
          }}
        >
          <FaBlog className="mr-2" />
          Blogs
        </li>
        <li
          role="button"
          tabIndex={0}
          className={`mb-2 cursor-pointer flex items-center ${getMenuItemClass(
            'portfolio'
          )} p-2 rounded`}
          onClick={() => handleNavigate('portfolio')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('portfolio');
            }
          }}
        >
          <FaBriefcase className="mr-2" />
          Portfolio
        </li>
        <li
          role="button"
          tabIndex={0}
          className={`mb-2 cursor-pointer flex items-center ${getMenuItemClass(
            'categories'
          )} p-2 rounded`}
          onClick={() => handleNavigate('categories')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('categories');
            }
          }}
        >
          <FaTags className="mr-2" />
          Categories
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
