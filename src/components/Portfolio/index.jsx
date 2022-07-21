import { useContext } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import { themeContext } from "../../context/Context";
import Blog from "../../assets/img/blog_app.png";
import AdminDashboard from "../../assets/img/dashboard.png";
import Ecommerce from "../../assets/img/ecommerce.png";
import MovieApp from "../../assets/img/movie_app.png";
import PortfolioApp from "../../assets/img/portfolio.png";
import Reservation from "../../assets/img/reservation.png";
import SOcialMedia from "../../assets/img/social_media.png";

import "./Portfolio.css";
const Portfolio = () => {
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  return (
    <div className="portfolio" id="portfolio">
      {/* heading */}
      <span style={{ color: darkMode ? "white" : "" }}>Recent Projects</span>
      <span>Portfolio</span>

      {/* slider */}
      <Swiper
        spaceBetween={10}
        slidesPerView={"auto"}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        grabCursor={true}
        className="portfolio-slider"
      >
        <SwiperSlide>
          <img
            src={MovieApp}
            alt=""
            onClick={() =>
              window.open("https://responsivemovie-app.netlify.app/", "_blank")
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={AdminDashboard}
            alt=""
            onClick={() =>
              window.open("https://admin-uidashboard.netlify.app", "_blank")
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={PortfolioApp}
            alt=""
            onClick={() =>
              window.open("https://anwarportfolio.netlify.app", "_blank")
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={SOcialMedia}
            alt=""
            onClick={() =>
              window.open("https://social-media-site-sr.netlify.app/", "_blank")
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={Reservation}
            alt=""
            onClick={() =>
              window.open("https://reservation-v1.netlify.app", "_blank")
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={Ecommerce}
            alt=""
            onClick={() =>
              window.open(
                "http://ecommerce-multi-vendor.herokuapp.com/",
                "_blank"
              )
            }
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={Blog}
            alt=""
            onClick={() =>
              window.open("http://advanceblog.herokuapp.com/", "_blank")
            }
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Portfolio;
