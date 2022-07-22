import React from "react";
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
              <Link to="/" className={`${pathname === "/" && "active"}`}>
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/portfolio"
                className={`${pathname === "/portfolio" && "active"}`}
              >
                Protfolio
              </Link>
            </li>
            <li>
              <Link
                to="/blogs"
                className={`${pathname === "/blogs" && "active"}`}
              >
                Blogs
              </Link>
            </li>
          </ul>
        </div>
        <Link to="contact">
          <button className="button n-button">Contact</button>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
