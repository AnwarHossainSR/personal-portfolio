import { motion } from 'framer-motion';
import { useContext } from 'react';
import { Link } from 'react-scroll';
import Amazon from '../../../assets/img/amazon.png';
import Facebook from '../../../assets/img/Facebook.png';
import Fiverr from '../../../assets/img/fiverr.png';
import Shopify from '../../../assets/img/Shopify.png';
import Upwork from '../../../assets/img/Upwork.png';
import { themeContext } from '../../../context/Context';

const Works = () => {
  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;

  // transition
  return (
    <div className="works" id="works">
      {/* left side */}
      <div className="w-left">
        <div className="awesome">
          {/* dark Mode */}
          <span style={{ color: darkMode ? 'white' : '' }}>
            Works for All these
          </span>
          <span>Brands & Clients</span>
          <span>
            As a software engineer, I developed and maintained complex software
            systems using various
            <br /> programming languages, frameworks, and tools. I collaborated
            <br />
            with cross-functional teams to identify and solve technical
            challenges,
            <br /> ensuring timely delivery of high-quality software products.
            My work experience
            <br /> involved designing scalable architectures, implementing
            robust solutions,
            <br /> and continuously improving code quality through code reviews
            and testing.
          </span>
          <Link to="contact" smooth spy>
            <button className="button s-button">Hire Me</button>
          </Link>
          <div className="blur s-blur1" style={{ background: '#ABF1FF94' }} />
        </div>

        {/* right side */}
      </div>
      <div className="w-right">
        <motion.div
          initial={{ rotate: 45 }}
          whileInView={{ rotate: 0 }}
          viewport={{ margin: '-40px' }}
          transition={{ duration: 3.5, type: 'spring' }}
          className="w-mainCircle"
        >
          <div className="w-secCircle">
            <img src={Upwork} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Fiverr} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Amazon} alt="" />
          </div>{' '}
          <div className="w-secCircle">
            <img src={Shopify} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Facebook} alt="" />
          </div>
        </motion.div>
        {/* background Circles */}
        <div className="w-backCircle blueCircle" />
        <div className="w-backCircle yellowCircle" />
      </div>
    </div>
  );
};

export default Works;
