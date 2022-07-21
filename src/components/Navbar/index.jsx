import React from 'react';
import { Link } from 'react-router-dom';
import Toggle from '../Toggle';
import './Navbar.css';
const navbar = () => {
  return (
    <div className='n-wrapper' id='Navbar'>
      {/* left */}
      <div className='n-left'>
        <div className='n-name'>Anwar</div>
        <Toggle />
      </div>
      {/* right */}
      <div className='n-right'>
        <div className='n-list'>
          <ul style={{ listStyleType: 'none' }}>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/portfolio'>Protfolio</Link>
            </li>
            <li>
              <Link to='/blogs'>Blogs</Link>
            </li>
          </ul>
        </div>
        <Link to='contact'>
          <button className='button n-button'>Contact</button>
        </Link>
      </div>
    </div>
  );
};

export default navbar;
