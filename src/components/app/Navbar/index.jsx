import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { GiCrossMark } from 'react-icons/gi';
import { GoThreeBars } from 'react-icons/go';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Toggle from '../Toggle';

const Navbar = ({ darkMode }) => {
  let { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open === true && window.innerWidth < 481) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [open]);

  return (
    <div className='n-wrapper' id='Navbar'>
      {/* left */}
      <div className='n-left'>
        <NavLink
          to='/'
          className='n-name'
          style={{
            color: 'var(--orange)',
          }}
        >
          Anwar
        </NavLink>
        <Toggle />
      </div>
      {/* right */}
      <div className='n-right'>
        <div className='n-list' style={{ display: open && 'block' }}>
          <ul style={{ listStyleType: 'none' }}>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                to='/'
                className={`${pathname === '/' && 'active'}`}
                onClick={() => setOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                to='/portfolio'
                className={`${pathname === '/portfolio' && 'active'}`}
                onClick={() => setOpen(false)}
              >
                Protfolio
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                to='/about'
                className={`${pathname === '/about' && 'active'}`}
                onClick={() => setOpen(false)}
              >
                About Me
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? 'var(--gray)' : '' }}
                to='/login'
                className={`${pathname === '/login' && 'active'}`}
                onClick={() => setOpen(false)}
              >
                Sign In
              </Link>
            </li>

            <div className='navbar-cross'>
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
        <Link to='contact' className='top-contact'>
          <button className='button n-button'>Contact</button>
        </Link>
        <div className='navbar-icon'>
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
            <GoThreeBars
              style={{ fontSize: '2rem' }}
              onClick={() => setOpen(true)}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;