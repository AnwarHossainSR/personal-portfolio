/* eslint-disable simple-import-sort/imports */

'use client';

import Toggle from '@/components/common/Toggle';
import { themeContext } from '@/providers/context/Context';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { FaBars } from 'react-icons/fa';
import { GiCrossMark } from 'react-icons/gi';

const Header = () => {
  const [open, setOpen] = useState(false);
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  useEffect(() => {
    if (open === true && window.innerWidth < 481) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <div className="n-wrapper" id="Navbar">
      {/* left */}
      <div className="n-left">
        <Link href="/"
          className="n-name"
          style={{
            color: 'var(--orange)',
          }}
        >
          Anwar
        </Link>
        <Toggle />
      </div>
      {/* right */}
      <div className="n-right">
        <div className="n-list" style={{ display: open ? 'block' : '' }}>
          <ul style={{ listStyleType: 'none' }}>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                href="/"
                //className={pathname === '/' && 'active'}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                href="/portfolio"
                //className={pathname === '/portfolio' && 'active'}
                onClick={() => setOpen(false)}
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                href="/play-list"
                //className={pathname === '/play-list' && 'active'}
                onClick={() => setOpen(false)}
              >
                Playlist
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                href="/about"
                //className={pathname === '/about' && 'active'}
                onClick={() => setOpen(false)}
              >
                About Me
              </Link>
            </li>

            <div className="navbar-cross">
              <motion.div
                whileHover={{
                  scale: 1.1,
                  transition: {
                    duration: 0.2,
                    ease: 'easeInOut',
                  },
                }}
                whileTap={{
                  scale: 0.8,
                  transition: {
                    duration: 0.2,
                    ease: 'easeInOut',
                  },
                }}
              >
                <GiCrossMark
                  onClick={() => setOpen(false)}
                  style={{ fontSize: '2rem', color: 'var(--orange)' }}
                />
              </motion.div>
            </div>
          </ul>
        </div>
        <Link href="/contact" className="top-contact">
          <button className="button n-button">Contact</button>
        </Link>
        <div className="navbar-icon">
          <motion.div
            whileHover={{
              scale: 1.1,
              transition: {
                duration: 0.2,
                ease: 'easeInOut',
              },
            }}
            whileTap={{
              scale: 0.8,
              transition: {
                duration: 0.2,
                ease: 'easeInOut',
              },
            }}
          >
            <FaBars
              style={{ fontSize: '1.5rem' }}
              onClick={() => setOpen(true)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Header;
