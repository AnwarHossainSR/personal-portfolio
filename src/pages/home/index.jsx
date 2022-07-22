import React from 'react';
import Contact from '../../components/Contact';
import Experience from '../../components/Experience';
import Intro from '../../components/Intro';
import Portfolio from '../../components/Portfolio';
import Services from '../../components/Services';
import Testimonial from '../../components/Testimonials';
import Works from '../../components/Works';
const Home = ({ darkMode }) => {
  return (
    <>
      <Intro />
      <Services darkMode={darkMode} />
      <Experience />
      <Works />
      <Portfolio />
      <Testimonial />
      <Contact />
    </>
  );
};

export default Home;
