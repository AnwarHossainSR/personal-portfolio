import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PortfolioCard from '../../../components/app/Card/PortfolioCard';
import Tab from '../../../components/app/Tab';
import WhiteSpace from '../../../components/app/whitespace/WhiteSpace';
import { projects, tags } from '../../../constant/portfolio';

const Portfolio = ({ darkMode }) => {
  const [filter, setFilter] = useState('all');
  const [portfolioProjects, setPortfolioProjects] = useState(projects);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    const filteredProjects = () => {
      if (filter === 'all') {
        return projects;
      }
      return projects.filter((project) => project.tags.includes(filter));
    };
    setPortfolioProjects(filteredProjects);
  }, [filter]);

  return (
    <>
      <Helmet>
        <title>Portfolio | Anwar Hossain | Portfolio</title>
      </Helmet>
      <div className="portfolio-page">
        <div className="portfolio-page__header">
          <p
            className="portfolio-page__header--text"
            style={{
              color: darkMode ? 'white' : '',
            }}
          >
            Some of my spare time tinkering.
          </p>
          <div className="portfolio-page__header--filter">
            {tags.map((tag, index) => (
              <Tab
                key={index}
                className={`${filter === tag.name ? 'active' : ''}`}
                text={tag.name}
                handleEvent={() => setFilter(tag.name)}
              />
            ))}
          </div>
        </div>
        <div className="portfolio-page__body">
          <motion.div layoutId="underline">
            <div className="portfolio-page__body--content">
              {portfolioProjects.map((project, index) => (
                <PortfolioCard key={index} project={project} />
              ))}
              {portfolioProjects.length === 0 &&
                `No projects found under ${filter} tag`}
            </div>
          </motion.div>
          <WhiteSpace height={200} />
        </div>
      </div>
    </>
  );
};

export default Portfolio;
