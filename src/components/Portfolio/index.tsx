'use client';

import ImageCard from '@/components/Image/Image';
import { projects } from '@/lib/const';
import { themeContext } from '@/providers/context/Context';
import Link from 'next/link';
import { useContext } from 'react';
import 'swiper/css';
//import 'swiper/css/pagination';
import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';


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
              <ImageCard
                project={project}
                handleEvent={() => window.open(project.link, '_blank')}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <div className="see-more">
        <Link href="/portfolio">
          <button className="button n-button">See More</button>
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
