import { Helmet } from 'react-helmet-async';
import Contact from '../../../components/app/Contact';
import Experience from '../../../components/app/Experience';
import Intro from '../../../components/app/Intro';
import Portfolio from '../../../components/app/Portfolio';
import Services from '../../../components/app/Services';
//import Testimonial from '../../../components/app/Testimonials';
import Works from '../../../components/app/Works';

const Home = ({ darkMode }) => {
  return (
    <>
      <Helmet>
        <title>Home | Anwar Hossain | Portfolio</title>
      </Helmet>
      <Intro />
      <Services darkMode={darkMode} />
      <Experience />
      <Works />
      <Portfolio />
      {/* <Testimonial /> */}
      <Contact />
    </>
  );
};

export default Home;
