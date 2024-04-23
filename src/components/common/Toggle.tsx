/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import { useTheme } from '@/providers/context/Context';
// import Moon from '@iconscout/react-unicons/icons/uil-moon';
// import Sun from '@iconscout/react-unicons/icons/uil-sun';

const Toggle = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const handleClick = () => {
    theme.dispatch({ type: 'toggle' });
  };

  return (
    <div className="toggle" onClick={handleClick}>
      {/* <Moon />
      <Sun /> */}
      <div
        className="t-button"
        style={darkMode ? { left: '2px' } : { right: '2px' }}
      />
    </div>
  );
};

export default Toggle;
