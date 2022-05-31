import Moon from "@iconscout/react-unicons/icons/uil-moon";
import Sun from "@iconscout/react-unicons/icons/uil-sun";
import React from "react";
import "./Toggle.css";
//import { themeContext } from "../../Context";

const Toggle = () => {
  //const theme = useContext(themeContext);
  const darkMode = false;
  const handleClick = () => {
    // debugger
    //theme.dispatch({ type: "toggle" });
  };
  return (
    <div className="toggle" onClick={handleClick}>
      <Moon />
      <Sun />
      <div
        className="t-button"
        style={darkMode ? { left: "2px" } : { right: "2px" }}
      ></div>
    </div>
  );
};

export default Toggle;
