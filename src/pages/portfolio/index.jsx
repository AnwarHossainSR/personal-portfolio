import React, { useEffect } from 'react';
import { FaSearchPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Tab from '../../components/Tab';
import { projects } from '../../constant/portfolio';

const Portfolio = ({ darkMode }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className='portfolio-page'>
      <div className='portfolio-page__header'>
        <p
          className='portfolio-page__header--text'
          style={{
            color: darkMode ? 'white' : '',
          }}
        >
          Some of my spare time tinkering.
        </p>
        <div className='portfolio-page__header--filter'>
          <Tab className='active' text='All' />
          <Tab text='React' />
          <Tab text='Nextjs' />
          <Tab text='Nodejs' />
          <Tab text='Laravel' />
          <Tab text='Native' />
        </div>
      </div>
      <div className='portfolio-page__body'>
        <div className='portfolio-page__body--content'>
          {projects.map((project, index) => (
            <div className='portfolio-page__body--content--item' key={index}>
              <p className='portfolio-page__body--content--item__text'>
                <Link to='/project link'>
                  <FaSearchPlus
                    style={{ fontSize: '2rem', color: 'var(--yellow)' }}
                  />
                  <span>{project.title}</span>
                </Link>
              </p>
              <img src={project.img} alt='icon' width={375} height={200} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
