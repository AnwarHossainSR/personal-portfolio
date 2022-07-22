import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';

import { Pagination } from 'swiper';
import 'swiper/css/pagination';
import { clients } from '../../constant/Clients';

const Testimonial = () => {
  return (
    <div className='t-wrapper' id='testimonial'>
      <div className='t-heading'>
        <span>Clients always get </span>
        <span>Exceptional Work </span>
        <span>from me...</span>
        <div
          className='blur t-blur1'
          style={{ background: 'var(--purple)' }}
        ></div>
        <div className='blur t-blur2' style={{ background: 'skyblue' }}></div>
      </div>
      <Swiper
        modules={[Pagination]}
        slidesPerView={2}
        pagination={{ clickable: true }}
      >
        {clients.map((client, index) => {
          return (
            <SwiperSlide key={index}>
              <div className='testimonial'>
                <img src={client.img} alt='' />
                <span>{client.review}</span>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Testimonial;
