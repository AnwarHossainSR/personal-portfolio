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
    <div className="flex mb-28">
      <Sidebar darkMode={darkMode} />
      <div className="flex-1 p-5">{children}</div>
    </div>
  );
};

export default AdminLayout;
