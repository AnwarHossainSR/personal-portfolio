import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination } from 'swiper';
import 'swiper/css/pagination';
import { clients } from '../../../constant/Clients';
import useWindowSize from '../../../hooks/useWindowSize';

const Testimonial = () => {
  const { width } = useWindowSize();

  return (
    <div className="t-wrapper" id="testimonial">
      <div className="t-heading">
        <span>Clients always get </span>
        <span>Exceptional Work </span>
        <span>from me...</span>
        <div className="blur t-blur1" style={{ background: 'var(--purple)' }} />
        <div className="blur t-blur2" style={{ background: 'skyblue' }} />
      </div>
      <Swiper
        modules={[Pagination]}
        slidesPerView={width <= 480 ? 1 : 3}
        pagination={{ clickable: true }}
      >
        {clients.map((client, index) => {
          return (
            <SwiperSlide key={index}>
              <div className="testimonial">
                <p className="review">{client.review}</p>
                <img src={client.img} alt="" />
                <h3 className="name">{client.name}</h3>
                <p className="designation">{client.designation}</p>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Testimonial;
