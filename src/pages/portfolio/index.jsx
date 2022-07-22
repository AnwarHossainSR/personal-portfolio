import React from "react";
import { FaSearchPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { projects } from "../../constant/portfolio";

const Portfolio = ({ darkMode }) => {
  return (
    <div className="portfolio-page">
      <div className="portfolio-page__header">
        <p
          className="portfolio-page__header--text"
          style={{
            color: darkMode ? "white" : "",
          }}
        >
          Some of my spare time tinkering.
        </p>
        <div className="portfolio-page__header--filter">
          <span className="active">All</span>
          <span>Web</span>
          <span>Mobile</span>
        </div>
      </div>
      <div className="portfolio-page__body">
        <div className="portfolio-page__body--content">
          {projects.map((project, index) => (
            <div className="portfolio-page__body--content--item" key={index}>
              <p className="portfolio-page__body--content--item__text">
                <Link to="/project link">
                  <FaSearchPlus
                    style={{ fontSize: "2rem", color: "var(--yellow)" }}
                  />
                </Link>
              </p>
              <img src={project.img} alt="icon" width={375} height={200} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
