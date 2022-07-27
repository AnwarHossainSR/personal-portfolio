import Blog from '../assets/img/blog_app.png';
import AdminDashboard from '../assets/img/dashboard.png';
import Ecommerce from '../assets/img/ecommerce.png';
import MovieApp from '../assets/img/movie_app.png';
import PortfolioApp from '../assets/img/portfolio.png';
import Reservation from '../assets/img/reservation.png';
import SocialMedia from '../assets/img/social_media.png';
import SocialSite from '../assets/img/social_site.png';
import YoutubeApp from '../assets/img/youtube-app.png';

export const projects = [
  {
    img : YoutubeApp,
    title : 'Youtube App',
    description :
        'A React app that allows users to search for videos and save them to their own personal library.',
    link : 'https://youtube-streaming.netlify.app/',
    tag : [ 'React', 'Redux', 'NodeJS', 'Express', 'MongoDB' ],
  },
  {
    img : SocialMedia,
    title : 'Social Media',
    description :
        'A social media app that allows users to share their posts and comments with other users.',
    link : 'https://social-media-site-sr.netlify.app',
  },
  {
    img : MovieApp,
    title : 'Movie App',
    description :
        'A movie app that allows users to search for movies and view their details.',
    link : 'https://responsivemovie-app.netlify.app',
  },
  {
    img : AdminDashboard,
    title : 'Admin Dashboard',
    description :
        'A admin dashboard that allows users to manage their website.',
    link : 'https://admin-uidashboard.netlify.app',
  },
  {
    img : PortfolioApp,
    title : 'Portfolio',
    description : 'A portfolio app that allows users to manage their projects.',
    link : 'https://anwarportfolio.netlify.app',
  },
  {
    img : SocialSite,
    title : 'Mateal Ui Social Site',
    description :
        'A social media app that allows users to share their posts and comments with other users.',
    link : 'https://material-ui-social-media.vercel.app/',
  },
  {
    img : Reservation,
    title : 'Reservation',
    description :
        'A reservation app that allows users to manage their reservations.',
    link : 'https://reservation-v1.netlify.app',
  },
  {
    img : Ecommerce,
    title : 'Ecommerce',
    description : 'A ecommerce app that allows users to manage their products.',
    link : 'http://ecommerce-multi-vendor.herokuapp.com/',
  },
  {
    img : Blog,
    title : 'Blog',
    description : 'A blog app that allows users to manage their posts.',
    link : 'http://advanceblog.herokuapp.com/',
  },
];
