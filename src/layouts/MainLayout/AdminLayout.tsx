'use client';

import type { ReactNode } from 'react';

import Sidebar from '@/components/Sidebar';

const AdminLayout = ({
  children,
  darkMode,
}: {
  children: ReactNode;
  darkMode: boolean;
}) => {
  return (
    <div
      className="flex"
      style={{
        marginBottom: '7rem',
      }}
    >
      <Sidebar darkMode={darkMode} />
      <div
        className="p-5 w-full" // Added padding instead of marginLeft
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
