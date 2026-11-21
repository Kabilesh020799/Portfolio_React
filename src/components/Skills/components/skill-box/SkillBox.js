import React, { memo, useEffect, useId, useRef, useState } from "react";
import "./SkillBox.scss";

const SkillBox = memo(function SkillBox({ name, projects = [], employers = [] }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const itemRef = useRef(null);
  const tooltipId = useId();
  const isOpen = isHovered || isFocused || isPinned;
  const projectNames = projects.map((project) => project.title);
  const associations = [
    projectNames.length > 0 && `projects: ${projectNames.join(", ")}`,
    employers.length > 0 && `experience: ${employers.join(", ")}`,
  ].filter(Boolean);

  useEffect(() => {
    if (!isPinned) return undefined;

    const closeWhenClickingOutside = (event) => {
      if (!itemRef.current?.contains(event.target)) {
        setIsPinned(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("pointerdown", closeWhenClickingOutside);
    return () => document.removeEventListener("pointerdown", closeWhenClickingOutside);
  }, [isPinned]);

  if (associations.length === 0) {
    return (
      <li className="skill-box">
        <span className="skill-box__chip">{name}</span>
      </li>
    );
  }

  const handlePointerEnter = (event) => {
    if (event.pointerType !== "touch") setIsHovered(true);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType !== "touch") setIsHovered(false);
  };

  const handleBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsFocused(false);
      setIsPinned(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      setIsHovered(false);
      setIsFocused(false);
      setIsPinned(false);
      event.currentTarget.querySelector("button")?.blur();
    }
  };

  return (
    <li
      className={`skill-box${isOpen ? " skill-box--open" : ""}`}
      ref={itemRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onFocusCapture={() => setIsFocused(true)}
      onBlurCapture={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <button
        className="skill-box__chip skill-box__trigger"
        type="button"
        aria-label={`${name}. ${associations.join("; ")}`}
        aria-expanded={isOpen}
        aria-controls={tooltipId}
        aria-describedby={isOpen ? tooltipId : undefined}
        onClick={() => setIsPinned((pinned) => !pinned)}
      >
        {name}
      </button>
      <span className="skill-box__popover" id={tooltipId} role="tooltip" hidden={!isOpen}>
        {projectNames.length > 0 && (
          <span className="skill-box__popover-row">
            <span className="skill-box__popover-label">Projects</span>
            <span>{projectNames.join(", ")}</span>
          </span>
        )}
        {employers.length > 0 && (
          <span className="skill-box__popover-row">
            <span className="skill-box__popover-label">Experience</span>
            <span>{employers.join(", ")}</span>
          </span>
        )}
      </span>
    </li>
  );
});

export default SkillBox;
