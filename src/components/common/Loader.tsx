'use client';

import { FallingLines } from 'react-loader-spinner';

import { useTheme } from '@/providers/context/Context';

const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div className="w-16">
        <FallingLines
          color="var(--main-color-orange)"
          width="50"
          visible
          // ariaLabel="falling-circles-loading"
        />
        {/* Optional: Loader text */}
        <p
          className="text-center mt-2"
          style={{
            color: darkMode ? 'var(--main-bg-light)' : 'var(--black)',
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;
