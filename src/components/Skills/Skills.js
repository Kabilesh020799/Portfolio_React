import React from "react";
import "./Skills.scss";
import { skillsData } from "../../data";
import SkillBox from "./components/skill-box/SkillBox";

function Skills() {
  return (
    <section className="SkillsSection" id="skills" aria-labelledby="skills-title">
      <div className="SkillsIntro">
        <h2 className="SkillsTitle" id="skills-title">
          Skills
        </h2>
      </div>

      <div className="Skills">
        {skillsData.map((skillGroup, index) => {
          const categoryId = `skill-category-${index}`;

          return (
            <section className="skill-group" key={skillGroup.category}>
              <h3 className="skill-category" id={categoryId}>
                {skillGroup.category}
              </h3>
              <ul className="skill-list" aria-labelledby={categoryId}>
                {skillGroup.skills.map((skill) => (
                  <SkillBox key={skill} name={skill} />
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </section>
  );
}

export default Skills;
