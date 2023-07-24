import { motion } from 'framer-motion';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import AnwarImage from '../../../assets/img/anwar.svg';
import Technology from '../../../components/app/Technology';
import { workData } from '../../../constant/About';
import { transition } from '../../../constant/FramerMotion';

const About = () => {
  const [active, setActive] = useState(0);
  return (
    <>
      <Helmet>
        <title>About Me | Anwar Hossain | Portfolio</title>
      </Helmet>
      <div className="about">
        <div className="about-heading">
          <div className="about-heading__serial">01.</div>
          <div className="about-heading__title">About Me</div>
          <div className="hr" />
        </div>
        <div className="about__description">
          <div className="about__description-left">
            Hello! My name is Anwar, and I enjoy creating things that live on
            the internet. My interest in web development started back in 2019
            when I decided to try editing custom Tumblr themes. It turns out
            that hacking together a custom reblog button taught me a lot about
            HTML & CSS!
            <br />
            <br />
            Fast-forward to today, and I have had the privilege of working at an
            advertising agency, a start-up, a huge corporation, and a
            student-led design studio. My main focus these days is building
            accessible, inclusive products and digital experiences at
            Upstatement for a variety of clients. <br />
            <br />
            Here are a few technologies I have been working with recently:
            <ul>
              <div className="left">
                <Technology technology="Javascript  (ES6+)" />
                <Technology technology="React" />
                <Technology technology="Nodejs" />
                <Technology technology="Typescript" />
                <Technology technology="Nextjs" />
              </div>
              <div className="right">
                <Technology technology="Php" />
                <Technology technology="Python" />
                <Technology technology="Mongodb" />
                <Technology technology="Firebase" />
                <Technology technology="Laravel" />
              </div>
            </ul>
          </div>
          <motion.div
            initial={{ left: '11rem' }}
            whileInView={{ left: '0rem' }}
            transition={transition}
            className="about__description-right"
          >
            <div className="about__description-right-item">
              <img src={AnwarImage} alt="" />
              <LazyLoadImage
                src={AnwarImage}
                alt="Anwar Hossain"
                effect="blur"
              />
              <div className="border" />
            </div>
          </motion.div>
        </div>
        <div className="about__work">
          <div className="about__work-heading">
            <div className="about__work-heading__serial">02.</div>
            <div className="about__work-heading__title">Where I’ve Worked</div>
            <div className="hr" />
          </div>
          <div className="about__work-body">
            <div className="about__work-body-left">
              <li
                className={active === 0 && 'active'}
                onClick={() => setActive(0)}
              >
                BJIT
              </li>
              <li
                className={active === 1 && 'active'}
                onClick={() => setActive(1)}
              >
                Annon Lab
              </li>
            </div>
            <div className="about__work-body-right">
              <motion.div
                initial={{ left: '11rem' }}
                whileInView={{ left: '0rem' }}
                transition={transition}
              >
                {workData.map(
                  (work, index) =>
                    index === active && (
                      <div key={index}>
                        <div className="about__work-body-right__heading">
                          {work.position} <span>@ {work.company}</span>
                        </div>
                        <div className="about__work-body-right__duration">
                          {work.duration}
                        </div>
                        <div className="about__work-body-right__description">
                          {work.description.map((desc, index) => (
                            <Technology key={index} technology={desc} />
                          ))}
                        </div>
                      </div>
                    ),
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
