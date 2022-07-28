import React from 'react';
import {BsGithub} from 'react-icons/bs';
const PortfolioCard = ({project}) => {
  return (
    <div>
      <div className='card-wrapper'>
        <div className='project-card'>
          <img className='project-card-image' src={project?.img} alt='' />
          <div className='project-descriptions'>
            <p>{project?.title}</p>
            <p>{project?.description}</p>
            <p>
              <BsGithub onClick={() => window.open(project.github, '_blank')} />
            </p>
            <div>
              {project.tags &&
                project?.tags.map((tag, index) => (
                  <span key={index}>#{tag}</span>
                ))}
            </div>
            <span className='view'>View</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
