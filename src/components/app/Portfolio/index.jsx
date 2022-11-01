import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from 'swiper';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { projects } from '../../../constant/portfolio';
import { themeContext } from '../../../context/Context';
import Image from '../Image/Image';

const Portfolio = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className="portfolio" id="portfolio">
      {/* heading */}
      <span style={{ color: darkMode ? 'white' : '' }}>Recent Projects</span>
      <span>Portfolio</span>

      {/* slider */}
      <Swiper
        spaceBetween={10}
        slidesPerView="auto"
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        grabCursor
        className="portfolio-slider"
      >
        {projects.length > 0 &&
          projects.map((project, index) => (
            <SwiperSlide key={index}>
              <Image
                project={project}
                handleEvent={() => window.open(project.link, '_blank')}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="see-more">
        <Link to="portfolio">
          <button className="button n-button">See More</button>
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
