import { motion } from 'framer-motion';
import Glasses from '../../../assets/img/glasses.png';
import HeartEmoji from '../../../assets/img/heartemoji.png';
import Humble from '../../../assets/img/humble.png';
import { transition } from '../../../constant/FramerMotion';
import Card from '../Card';
import Resume from './resume.pdf';

const Services = ({ darkMode }) => {
  return (
    <div className="services" id="services">
      {/* left side */}
      <div className="awesome">
        {/* dark mode */}
        <span style={{ color: darkMode ? 'white' : '' }}>My Awesome</span>
        <span>services</span>
        <span>
          Since beginning my journey as a freelance designer over 5 years,
          <br />
          I have done remote work for agencies, consulted for startups, and
          collaborated with talented people
          <br />
          to create digital products for both business and consumer use. I am
          quietly confident,
          <br />
          naturally curious, and perpetually working on improving my work all
          time.
        </span>
        <a href={Resume} target="_blank" download rel="noreferrer">
          <button className="button s-button">Download CV</button>
        </a>
        <div className="blur s-blur1" style={{ background: '#ABF1FF94' }} />
      </div>
      {/* right */}
      <div className="cards">
        {/* first card */}
        <motion.div
          initial={{ left: '25rem' }}
          whileInView={{ left: '14rem' }}
          transition={transition}
        >
          <Card
            emoji={HeartEmoji}
            heading="Design"
            detail="Figma, Sketch, Photoshop, Adobe xd"
            darkMode={darkMode}
          />
        </motion.div>
        {/* second card */}
        <motion.div
          initial={{ left: '-11rem', top: '12rem' }}
          whileInView={{ left: '-4rem' }}
          transition={transition}
        >
          <Card
            emoji={Glasses}
            heading="Developer"
            detail=".Net, Laravel, JavaScript, React, Nodejs, Express, Typescript"
            darkMode={darkMode}
          />
        </motion.div>
        {/* 3rd */}
        <motion.div
          initial={{ top: '19rem', left: '25rem' }}
          whileInView={{ left: '12rem' }}
          transition={transition}
        >
          <Card
            emoji={Humble}
            heading="UI/UX"
            detail="There some project what i have designed and developed, and also some of the project i have worked on."
            darkMode={darkMode}
          />
        </motion.div>
        <div className="blur s-blur2" style={{ background: 'var(--purple)' }} />
      </div>
    </div>
  );
};

export default Services;
