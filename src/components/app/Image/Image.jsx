import { LazyLoadImage } from 'react-lazy-load-image-component';
const Image = ({ project, handleEvent }) => {
  return (
    <LazyLoadImage
      alt={project.title}
      effect="blur"
      src={project.img}
      onClick={handleEvent}
    />
  );
};

export default Image;
