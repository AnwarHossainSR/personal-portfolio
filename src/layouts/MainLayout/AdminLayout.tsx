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
    <div className="admin-main">
      <Sidebar darkMode={darkMode} />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default AdminLayout;
