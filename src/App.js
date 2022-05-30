import React from "react";
import "./App.css";
import Intro from "./components/Intro/Intro";
import Navbar from "./components/Navbar/Navbar";
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
    </div>
  );
};

export default App;
