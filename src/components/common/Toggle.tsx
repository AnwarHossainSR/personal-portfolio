/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */

'use client';

import { FaMoon } from 'react-icons/fa';
import { MdSunny } from 'react-icons/md';

import { useTheme } from '@/providers/context/Context';

const Toggle = () => {
  const theme = useTheme();
  const { darkMode } = theme.state;
  const handleClick = () => {
    theme.dispatch({ type: 'toggle' });
  };

  return (
    <div className="toggle" onClick={handleClick}>
      <FaMoon />
      <MdSunny />
      <div
        className="t-button"
        style={darkMode ? { left: '2px' } : { right: '2px' }}
      />
    </div>
  );
};

export default Toggle;
