'use client';

import { FallingLines } from 'react-loader-spinner';

import { useTheme } from '@/providers/context/Context';

const Loader = ({ text = 'Loading...' }: { text?: string }) => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: darkMode ? 'var(--black)' : 'var(--main-bg-light)',
      }}
    >
      <div style={{ width: '60px' }}>
        <FallingLines
          color="var(--main-color-orange)"
          width="50"
          visible
          // ariaLabel="falling-circles-loading"
        />
        {/* Optional: Loader text */}
        <p
          style={{
            textAlign: 'center',
            color: 'var(--main-bg-light)',
            marginTop: '10px',
          }}
        >
          {text}
        </p>
      </div>
    </div>
  );
};

export default Loader;
