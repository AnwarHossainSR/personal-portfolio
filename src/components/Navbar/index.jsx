import React from "react";
import { GoThreeBars } from "react-icons/go";
import { Link, NavLink, useLocation } from "react-router-dom";
import Toggle from "../Toggle";
const Navbar = ({ darkMode }) => {
  let { pathname } = useLocation();

  return (
    <div className="n-wrapper" id="Navbar">
      {/* left */}
      <div className="n-left">
        <NavLink
          to="/"
          className="n-name"
          style={{
            color: darkMode ? "white" : "",
          }}
        >
          Anwar
        </NavLink>
        <Toggle />
      </div>
      {/* right */}
      <div className="n-right">
        <div className="n-list">
          <ul style={{ listStyleType: "none" }}>
            <li>
              <Link
                style={{ color: darkMode ? "white" : "" }}
                to="/"
                className={`${pathname === "/" && "active"}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? "white" : "" }}
                to="/portfolio"
                className={`${pathname === "/portfolio" && "active"}`}
              >
                Protfolio
              </Link>
            </li>
            <li>
              <Link
                style={{ color: darkMode ? "white" : "" }}
                to="/about"
                className={`${pathname === "/about" && "active"}`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>
        <Link to="contact">
          <button className="button n-button">Contact</button>
        </Link>
        <div className="navbar-icon">
          <GoThreeBars style={{ fontSize: "2rem" }} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
