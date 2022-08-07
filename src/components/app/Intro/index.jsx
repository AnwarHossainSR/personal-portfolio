//import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import { useContext } from "react";
import { Link } from "react-scroll";
import boy from "../../../assets/img/boy.png";
import crown from "../../../assets/img/crown.png";
import Github from "../../../assets/img/github.png";
import glassesimoji from "../../../assets/img/glassesimoji.png";
import Instagram from "../../../assets/img/instagram.png";
import LinkedIn from "../../../assets/img/linkedin.png";
import thumbup from "../../../assets/img/thumbup.png";
import Vector1 from "../../../assets/img/Vector1.png";
import Vector2 from "../../../assets/img/Vector2.png";
import { themeContext } from "../../../context/Context";
import FloatinDiv from "../FloatingDiv";
const Intro = () => {
  // Transition
  const transition = { duration: 2, type: "spring" };

  // context
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  return (
    <div className="Intro" id="Intro">
      {/* left name side */}
      <div className="i-left">
        <div className="i-name">
          {/* yahan change hy darkmode ka */}
          <span style={{ color: darkMode ? "white" : "" }}>Hy! I Am</span>
          <span>Anwar Hossain</span>
          <span>
            Full-Stack Developer with high level of experience in web designing
            and development, producting the Quality work
          </span>
        </div>
        <Link to="contact" smooth={true} spy={true}>
          <button className="button i-button">Hire me</button>
        </Link>
        {/* social icons */}
        <div className="i-icons">
          <img
            src={Github}
            alt="github"
            onClick={() => openInNewTab("https://github.com/AnwarHossainSR")}
          />
          <img
            src={LinkedIn}
            alt="linkdin"
            onClick={() => openInNewTab("https://www.linkedin.com/in/anwarsr/")}
          />
          <img
            src={Instagram}
            alt="instragram"
            onClick={() =>
              openInNewTab("https://www.instagram.com/mahedi_hasan_sr/")
            }
          />
        </div>
      </div>
      {/* right image side */}
      <div className="i-right">
        <img src={Vector1} alt="" />
        <img src={Vector2} alt="" />
        <img src={boy} alt="" />
        {/* animation */}
        <motion.img
          initial={{ left: "-36%" }}
          whileInView={{ left: "-24%" }}
          transition={transition}
          src={glassesimoji}
          alt=""
        />

        <motion.div
          initial={{ top: "-4%", left: "74%" }}
          whileInView={{ left: "68%" }}
          transition={transition}
          className="floating-div"
        >
          <FloatinDiv img={crown} text1="Web" text2="Developer" />
        </motion.div>

        {/* animation */}
        <motion.div
          initial={{ left: "9rem", top: "18rem" }}
          whileInView={{ left: "0rem" }}
          transition={transition}
          className="floating-div"
        >
          {/* floatinDiv mein change hy dark mode ka */}
          <FloatinDiv img={thumbup} text1="Best Design" text2="Award" />
        </motion.div>

        <div className="blur" style={{ background: "rgb(238 210 255)" }}></div>
        <div
          className="blur"
          style={{
            background: "#C1F5FF",
            top: "17rem",
            width: "21rem",
            height: "11rem",
            left: "-9rem",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Intro;
