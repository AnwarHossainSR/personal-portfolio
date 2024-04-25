import { GiCutDiamond } from 'react-icons/gi';
import { MdComputer, MdOutlineMobileFriendly } from 'react-icons/md';

import Blog from '@/assets/img/blog_app.png';
import Chat from '@/assets/img/chat.png';
import Course from '@/assets/img/course.png';
import AdminDashboard from '@/assets/img/dashboard.png';
import Dev from '@/assets/img/dev.png';
import Doctor from '@/assets/img/doctor.png';
import EcommerceApp from '@/assets/img/ecommerce-app.png';
import Ecommerce from '@/assets/img/ecommerce.png';
import OpenAIKeywordExtract from '@/assets/img/keywordExtraction.png';
import MovieApp from '@/assets/img/movie_app.png';
import PortfolioApp from '@/assets/img/portfolio.png';
import AdminPro from '@/assets/img/react-admin-pro.png';
import Reservation from '@/assets/img/reservation.png';
import SocialMedia from '@/assets/img/social_media.png';
import SocialSite from '@/assets/img/social_site.png';
import Spotify from '@/assets/img/spotify.png';
import TwitterClone from '@/assets/img/twitter-clone.png';
import YoutubeApp from '@/assets/img/youtube-app.png';
import ZoomClone from '@/assets/img/zoom-clone.png';

export const projects = [
  {
    img: ZoomClone,
    title: 'Zoom Clone App',
    description: 'A clone of Zoom app with full featured',
    link: 'https://next-zoom-clone-rosy.vercel.app/',
    tags: [
      'Next JS',
      'Tailwind CSS',
      'Clark auth',
      'video call',
      'chat',
      'streaming',
    ],
    github: 'https://github.com/AnwarHossainSR/next-zoom-clone',
  },
  {
    img: OpenAIKeywordExtract,
    title: 'Open AI Keyword Extract',
    description: 'Open AI Keyword Extract with full featured',
    link: 'https://ai-keyword-extractor-eight.vercel.app/',
    tags: ['Next JS', 'Open AI', 'Txt Extraction'],
    github: 'https://github.com/AnwarHossainSR/ai-keyword-extractor',
  },
  {
    img: Chat,
    title: 'Chatvia - Chatting platform',
    description: 'Chatting platform with full featured',
    link: 'https://react-firebase-chat-application.vercel.app/',
    tags: ['react', 'redux', 'material ui', 'firebase', 'vite', 'nodejs'],
    github:
      'https://github.com/AnwarHossainSR/mern-course-platform-frontend-yt',
  },
  {
    img: Course,
    title: 'Subscription Course Platform',
    description: 'Subscription Course Platform with full featured',
    link: 'https://mern-subscription.vercel.app/',
    tags: [
      'react',
      'redux',
      'sass',
      'material ui',
      'mongodb',
      'express',
      'nodejs',
    ],
    github:
      'https://github.com/AnwarHossainSR/mern-course-platform-frontend-yt',
  },
  {
    img: AdminPro,
    title: 'Admin Pro Dashboard',
    description: 'Admin Pro Dashboard application with full functionality',
    link: 'https://admin-dashboard-pro.vercel.app/',
    tags: [
      'react',
      'redux',
      'sass',
      'material ui',
      'data-grid',
      'mongodb',
      'formik',
      'yup',
      'chartjs',
      'calender',
    ],
    github: 'https://github.com/AnwarHossainSR/admin-dashboard-pro',
  },
  {
    img: Doctor,
    title: 'Doctor Appointment',
    description: 'Doctor Appointment application with full featured',
    link: 'https://doccure-appointment.vercel.app/',
    tags: ['react', 'redux', 'sass', 'nodejs', 'express', 'mongodb'],
    github: 'https://github.com/AnwarHossainSR/doccure-doctor-appointment',
  },
  {
    img: Spotify,
    title: 'Spotify clone',
    description: 'A clone of Spotify app',
    link: 'https://nextjs-spotify-clone-v1.vercel.app/',
    tags: ['react', 'nextjs', 'recoil', 'tailwindcss'],
    github: 'https://github.com/AnwarHossainSR/nextjs-spotify-clone',
  },

  {
    img: EcommerceApp,
    title: 'Ecommerce Application',
    description: 'A ecommerce app that allows users to manage their products.',
    link: 'https://ecommerce-v3.netlify.app/',
    tags: ['react', 'javascript'],
    github: 'https://github.com/AnwarHossainSR/ecommerce-client',
  },
  {
    img: TwitterClone,
    title: 'Twitter Clone',
    description: 'A Twitter clone built with React and redux.',
    link: 'https://twitter-clone-v2.netlify.app/',
    tags: ['react', 'nextjs', 'recoil', 'firebase', 'tailwindcss'],
    github: 'https://github.com/AnwarHossainSR/twitter-clone',
  },
  {
    img: Dev,
    title: 'dev.to clone',
    description: 'A clone of dev.to website',
    link: 'https://dev-to-clone-v1.netlify.app/',
    tags: ['react', 'nodejs', 'sass'],
    github: 'https://github.com/AnwarHossainSR/dev.to-clone',
  },
  {
    img: YoutubeApp,
    title: 'Video Streaming App',
    description:
      'A React app that allows users to search for videos and save them to their own personal library.',
    link: 'https://youtube-clone-v007.netlify.app/',
    tags: ['react', 'redux', 'nodeJS', 'express', 'mongodb'],
    github: 'https://github.com/AnwarHossainSR/youtube-clone-yt',
  },
  {
    img: SocialMedia,
    title: 'Social Media',
    description:
      'A social media app that allows users to share their posts and comments with other users.',
    link: 'https://social-media-site-sr.netlify.app',
    tags: ['react', 'redux', 'nodeJS', 'express', 'mongodb'],
    github: 'https://github.com/AnwarHossainSR/social-media-frontend',
  },
  {
    img: MovieApp,
    title: 'Movie App',
    description:
      'A movie app that allows users to search for movies and view their details.',
    link: 'https://responsivemovie-app.netlify.app',
    tags: ['react', 'redux'],
    github: 'https://github.com/AnwarHossainSR/react-responsive-movie-app',
  },
  {
    img: AdminDashboard,
    title: 'Admin Dashboard',
    description: 'A admin dashboard that allows users to manage their website.',
    link: 'https://admin-uidashboard.netlify.app',
    tags: ['react', 'redux', 'contextapi'],
    github: 'https://github.com/AnwarHossainSR/react-admin-dashboard-ui',
  },
  {
    img: PortfolioApp,
    title: 'Portfolio',
    description: 'A portfolio app that allows users to manage their projects.',
    link: 'https://anwarportfolio.netlify.app',
    tags: ['react', 'redux', 'firebase', 'contextapi'],
    github: 'https://github.com/AnwarHossainSR/portfolio-2022',
  },
  {
    img: SocialSite,
    title: 'Mateal Ui Social Site',
    description:
      'A social media app that allows users to share their posts and comments with other users.',
    link: 'https://material-ui-social-media.vercel.app/',
    tags: ['react', 'redux', 'matrialui'],
    github: 'https://github.com/AnwarHossainSR/material-ui-social-media',
  },
  {
    img: Reservation,
    title: 'Reservation',
    description:
      'A reservation app that allows users to manage their reservations.',
    link: 'https://reservation-v1.netlify.app',
    tags: ['react', 'redux', 'nodeJS', 'express', 'mongodb'],
    github: 'https://github.com/AnwarHossainSR/mern-reservation-app-client',
  },
  {
    img: Ecommerce,
    title: 'Multivendor Ecommerce',
    description: 'A ecommerce app that allows users to manage their products.',
    link: 'http://ecommerce-multi-vendor.herokuapp.com/',
    tags: ['laravel', 'php', 'jquery', 'javascript', 'mysql'],
    github: 'https://github.com/AnwarHossainSR/laravel-multi-vendor-ecommerce',
  },
  {
    img: Blog,
    title: 'Blog',
    description: 'A blog app that allows users to manage their posts.',
    link: 'http://advanceblog.herokuapp.com/',
    tags: ['laravel', 'php', 'jquery', 'javascript', 'mysql'],
    github: 'https://github.com/AnwarHossainSR/Laravel_Advance_Blog',
  },
];

export const tags = [
  {
    name: 'all',
  },
  {
    name: 'react',
  },
  {
    name: 'nextjs',
  },
  {
    name: 'nodejs',
  },
  {
    name: 'laravel',
  },
  {
    name: 'native',
  },
];

export const specializationData = [
  {
    img: MdComputer,
    title: 'Web Development',
    description:
      'Working with client and community, we deliver masterplans that create vibrant new places and spaces, attract people, and encourage investment through.',
  },
  {
    img: MdOutlineMobileFriendly,
    title: 'Mobile Coding',
    description:
      'Working with client and community, we deliver masterplans that create vibrant new places and spaces, attract people, and encourage investment through.',
  },
  {
    img: GiCutDiamond,
    title: 'UI/UX Design',
    description:
      'Working with client and community, we deliver masterplans that create vibrant new places and spaces, attract people, and encourage investment through.',
  },
];

// transition
export const transition = {
  duration: 1,
  type: 'spring',
};

export const YoutubePlaylistLink = [
  {
    link: 'JuKYmB1zB18',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUPiYuBqXooqu3C9v_jSLXbH',
    title: 'ReactJS',
  },
  {
    link: '0hf0xKnWhT8',
    title: 'ReactJS',
  },
  {
    link: 'ahvLe-wpSIw',
    title: 'ReactJS',
  },
  {
    link: 'rmKawwRTThM',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUPV7JTSeK9g__8j1YSGSAIn',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUNP7au7idLIZwFjD_Li_nsO',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUNlox-ZRSmhfrYsqe1o1p1a',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUO3StdD2VWubQ23Ps2-EHt2',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUOB5MODA2_NZ_meW_EssMOy',
    title: 'ReactJS',
  },
  {
    link: 'videoseries?list=PLOUudhWYmRUOQgdGkqjA7_T0biWQsbK38',
    title: 'ReactJS',
  },
];

export const workData = [
  {
    position: 'Software Development Engineer II',
    company: 'Craftsmen LTD',
    duration: 'May 2024 - Present',
    description: [
      'Write modern, performant, maintainable code for a diverse array of client and internal projects',
      'Work with a variety of different languages, platforms, frameworks, and content management systems such as JavaScript, TypeScript, React, Python, Django, AWS, Video streaming, Serverless',
      'Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis',
    ],
  },
  {
    position: 'Software Engineer',
    company: 'BJIT',
    duration: 'Aug 2021 - April 2024',
    description: [
      'Write modern, performant, maintainable code for a diverse array of client and internal projects',
      'Work with a variety of different languages, platforms, frameworks, and content management systems such as JavaScript, TypeScript, React, Php, Laravel, Python, Django, Craft, Prismic, Vercel, AWS and Netlify',
      'Communicate with multi-disciplinary teams of engineers, designers, producers, and clients on a daily basis',
    ],
  },
  {
    position: 'Junior Software Engineer',
    duration: 'Jan 2021 - Jun 2021',
    company: 'Annon Lab',
    description: [
      'Worked with a team of three designers to build a marketing website and e-commerce platform for blistabloc, an ambitious startup originating from Northeastern',
      'Interfaced with clients on a weekly basis, providing technological expertise',
      'Worked closely with designers and management team to develop, document, and manage the conference’s marketing website using Jekyll, Sass, Php, and JavaScript',
    ],
  },
];
