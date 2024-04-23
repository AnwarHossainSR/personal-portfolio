/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */

'use client';

import { useEffect, useRef, useState } from 'react';
import { AiOutlineArrowUp } from 'react-icons/ai';
import { animateScroll as scroll } from 'react-scroll';

import MainFooter from '@/components/Footer';
import Header from '@/components/Header';
import { useTheme } from '@/providers/context/Context';
import type { ChildrenProps } from '@/types';

export default function MainLayout({ children }: ChildrenProps) {
  const [showGoTop, setShowGoTop] = useState(false);
  const theme = useTheme();
  const { darkMode } = theme.state;
  const ref = useRef<HTMLDivElement>(null); // Specify the type of ref

  // DISPLAY HANDLER
  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    if (position > 120) {
      setShowGoTop(true);
    } else if (position < 120) {
      setShowGoTop(false);
    }
  };

  // SCROLL LISTENER
  useEffect(() => {
    if (ref?.current?.clientHeight && ref?.current?.clientHeight < 300)
      setShowGoTop(false);
    window.addEventListener('scroll', handleVisibleButton);
    return () => window.removeEventListener('scroll', handleVisibleButton);
  }, []);

  return (
    <div
      className="App"
      style={{
        background: darkMode ? 'var(--black)' : '',
        color: darkMode ? 'white' : '',
      }}
      ref={ref}
    >
      <Header darkMode={darkMode} />
      {children}
      <div
        className={`${showGoTop ? 'scroll-top-visible' : 'scroll-top-hidden'}`}
        onClick={() => scroll.scrollToTop()}
      >
        <AiOutlineArrowUp />
      </div>
      <MainFooter />
    </div>
  );
}
