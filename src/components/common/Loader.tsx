import React from 'react';
import { FallingLines } from 'react-loader-spinner';

import { useTheme } from '@/providers/context/Context';

type LoaderProps = {
  text?: string;
};

const Loader: React.FC<LoaderProps> = ({ text }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="w-16">
        <FallingLines color="var(--main-color-orange)" width="50" visible />
        <p
          className="text-center mt-2"
          style={{
            color: darkMode ? 'var(--main-bg-light)' : 'var(--black)',
          }}
        >
          {text || 'Loading...'}
        </p>
      </div>
    </div>
  );
};

export default Loader;
