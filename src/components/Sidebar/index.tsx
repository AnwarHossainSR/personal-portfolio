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
      className="sidebar"
      style={{
        color: darkMode ? 'white' : 'var(--dark)',
        backgroundColor: darkMode ? '#1E293B' : 'var(--yellow)',
        borderRight: darkMode ? '1px solid var(--gray)' : '',
      }}
    >
      <ul>
        <li
          role="button"
          tabIndex={0}
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
