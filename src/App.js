import React from "react";
import "./App.css";
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
import Services from "./components/Services/Services";
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
    </div>
  );
};

export default App;
