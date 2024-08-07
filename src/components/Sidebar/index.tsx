/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */

'use client';

import { useRouter } from 'next/navigation';

const Sidebar = ({ darkMode }: { darkMode: boolean }) => {
  const { push } = useRouter();
  const handleNavigate = (path: string) => {
    push(`/admin/${path}`);
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
          className="mb-2 cursor-pointer hover:underline"
          onClick={() => handleNavigate('dashboard')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('dashboard');
            }
          }}
        >
          Dashboard
        </li>
        <li
          role="button"
          tabIndex={0}
          className="mb-2 cursor-pointer hover:underline"
          onClick={() => handleNavigate('blogs')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('blogs');
            }
          }}
        >
          Blogs
        </li>
        <li
          role="button"
          tabIndex={0}
          className="mb-2 cursor-pointer hover:underline"
          onClick={() => handleNavigate('portfolio')}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleNavigate('portfolio');
            }
          }}
        >
          Portfolio
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
