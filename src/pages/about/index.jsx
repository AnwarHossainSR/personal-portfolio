import React from "react";
import SelfCard from "../../components/Card/SelfCard";
import SpecializationCard from "../../components/Card/SpecializationCard";
import { educationalData } from "../../constant/About";
import { specializationData } from "../../constant/portfolio";

const About = ({ darkMode }) => {
  return (
    <div className="about">
      <div className="about-content">
        <div className="about-content__specialization">
          <h1>
            <span>My</span> specialization
          </h1>
          <div className="about-content__specialization--content">
            {specializationData.map((specialization, index) => (
              <SpecializationCard
                key={index}
                Icon={specialization.img}
                title={specialization.title}
                description={specialization.description}
                darkMode={darkMode}
              />
            ))}
          </div>
          <div className="about-content__specialization__info">
            <div className="about-content__specialization__info-left">
              <div className="title">Education</div>
              <SelfCard data={educationalData.length && educationalData[0]} />
              <hr />
              <SelfCard data={educationalData.length && educationalData[1]} />
            </div>
            <div className="about-content__specialization__info-right">
              <div className="title">Experience</div>
              <SelfCard data={educationalData.length && educationalData[0]} />
              <hr />
              <SelfCard data={educationalData.length && educationalData[1]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
