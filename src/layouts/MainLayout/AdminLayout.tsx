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
        className="flex-1"
        style={{
          marginLeft: '1.25rem',
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
