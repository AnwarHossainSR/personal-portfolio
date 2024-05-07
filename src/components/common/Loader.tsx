'use client';

import { FallingLines } from 'react-loader-spinner';

import { useTheme } from '@/providers/context/Context';

const Loader = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: darkMode ? 'var(--black)' : 'var(--main-bg-light)',
      }}
    >
      <div style={{ width: '100px' }}>
        <FallingLines
          color="var(--main-color-orange)"
          width="100"
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
          Loading...
        </p>
      </div>
    </div>
  );
};

export default Loader;
