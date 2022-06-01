import React, { useContext, useEffect, useRef, useState } from "react";
import { AiOutlineArrowUp } from "react-icons/ai";
import { animateScroll as scroll } from "react-scroll";
import "./App.css";
import Contact from "./components/Contact/Contact";
import Experience from "./components/Experience/Experience";
import Footer from "./components/Footer/Footer";
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
import Portfolio from "./components/Portfolio/Portfolio";
import Services from "./components/Services/Services";
import Testimonial from "./components/Testimonials/Testimonial";
import Works from "./components/Works/Works";
import { themeContext } from "./Context";
const App = () => {
  const [showGoTop, setshowGoTop] = useState(false);
  const theme = useContext(themeContext);
  const darkMode = theme.state.darkMode;
  const ref = useRef(null);

  //DISPLAY HANDLER
  const handleVisibleButton = () => {
    const position = window.pageYOffset;
    if (position > 120) {
      return setshowGoTop(true);
    } else if (position < 120) {
      return setshowGoTop(false);
    }
  };

  //SCROLL LISTENER
  useEffect(() => {
    if (ref?.current.clientHeight < 300) {
      console.log("called");
      setshowGoTop(false);
    }
    window.addEventListener("scroll", handleVisibleButton);
  }, [ref]);

  return (
    <div
      className="App"
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
      }}
      ref={ref}
    >
      <Navbar />
      <Intro />
      <Services />
      <Experience />
      <Works />
      <Portfolio />
      <Testimonial />
      <Contact />
      <Footer />
      <div
        className={`${showGoTop ? "scroll-top-visible" : "scroll-top-hidden"}`}
        onClick={() => scroll.scrollToTop()}
      >
        <AiOutlineArrowUp />
      </div>
    </div>
  );
};

export default App;
