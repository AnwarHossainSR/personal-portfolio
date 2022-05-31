import React from "react";
import "./App.css";
import Experience from "./components/Experience/Experience";
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
import Portfolio from "./components/Portfolio/Portfolio";
import Services from "./components/Services/Services";
import Works from "./components/Works/Works";
import Testimonial from "./components/Testimonials/Testimonial";
const App = () => {
  const darkMode = false;
  return (
    <div
      className="App"
      style={{
        background: darkMode ? "black" : "",
        color: darkMode ? "white" : "",
      }}
    >
      <Navbar />
      <Intro />
      <Services />
      <Experience />
      <Works />
      <Portfolio />
      <Testimonial />
    </div>
  );
};

export default App;
