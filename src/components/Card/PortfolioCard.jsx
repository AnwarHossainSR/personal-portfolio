import { BsGithub } from 'react-icons/bs';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const PortfolioCard = ({ project }) => {
  return (
    <div>
      <div className="card-wrapper">
        <div className="project-card">
          <LazyLoadImage
            alt={project?.title}
            effect="blur"
            src={project?.img}
            className="project-card-image"
          />
          {/* <img className='project-card-image' src={project?.img} alt='' /> */}
          <div className="project-descriptions">
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
            <span
              className="view"
              onClick={() => window.open(project.link, '_blank')}
            >
              View
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioCard;
