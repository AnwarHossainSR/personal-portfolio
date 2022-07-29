import AnwarImage from "../../assets/img/anwar.svg";
import Technology from "../../components/Technology";

const About = ({ darkMode }) => {
  return (
    <div className="about">
      <div className="about-heading">
        <div className="about-heading__serial">01.</div>
        <div className="about-heading__title">About Me</div>
        <div className="hr"></div>
      </div>
      <div className="about__description">
        <div className="about__description-left">
          Hello! My name is Brittany and I enjoy creating things that live on
          the internet.My interest in web development started back in 2019 when
          I decided to try editing custom Tumblr themes — turns out hacking
          together a custom reblog button taught me a lot about HTML&CSS!Fast -
          forward to today, and I’ve had the privilege of working at an
          advertising agency, a start - up, a huge corporation, and a student -
          led design studio. My main focus these days is building accessible,
          inclusive products and digital experiences at Upstatement for a
          variety of clients. <br />
          <br />
          Here are a few technologies I’ve been working with recently:
          <ul>
            <div className="left">
              <Technology technology="Javascript" />
              <Technology technology="React" />
              <Technology technology="Nodejs" />
              <Technology technology="Typescript" />
              <Technology technology="Nextjs" />
            </div>
            <div className="right">
              <Technology technology="Php" />
              <Technology technology="Mongodb" />
              <Technology technology="Firebase" />
              <Technology technology="Laravel" />
            </div>
          </ul>
        </div>
        <div className="about__description-right">
          <div className="about__description-right-item">
            <img src={AnwarImage} alt="" />
            <div className="border"></div>
          </div>
        </div>
      </div>
      <div className="about__work">
        <div className="about__work-heading">
          <div className="about__work-heading__serial">02.</div>
          <div className="about__work-heading__title">Where I’ve Worked</div>
          <div className="hr"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
