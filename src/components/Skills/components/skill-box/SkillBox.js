import React, { memo } from "react";
import "./SkillBox.scss";

const SkillBox = memo(function SkillBox({ name }) {
  return <li className="skill-box">{name}</li>;
});

export default SkillBox;
