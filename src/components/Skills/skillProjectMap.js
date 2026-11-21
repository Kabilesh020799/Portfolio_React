import { projects } from "../../data";

const projectTechnologyAliases = {
  "react js": ["react"],
  "vue js": ["vue.js"],
  "html/css": ["html", "css"],
  "aws lambda": ["aws"],
};

const employersBySkill = {
  datadog: ["Redbrick"],
  typescript: ["Mad Street Den", "Redbrick", "Global Relay", "Vidgyor"],
  javascript: ["Vidgyor"],
  "nuxt.js": ["Redbrick"],
  go: ["Mad Street Den"],
  python: ["Mad Street Den", "Vidgyor"],
  django: ["Mad Street Den"],
  "github actions": ["Mad Street Den", "Redbrick", "Global Relay"],
  kubernetes: ["Mad Street Den"],
  docker: ["Mad Street Den"],
  playwright: ["Redbrick", "Global Relay"],
  jest: ["Mad Street Den", "Global Relay"],
  vitest: ["Redbrick"],
  "testing library": ["Redbrick", "Mad Street Den", "Global Relay"],
  dynamodb: ["Mad Street Den"],
  "node.js": ["Mad Street Den"],
};

const normalize = (technology) => technology.trim().toLowerCase();

const projectsBySkill = projects.reduce((matches, project) => {
  (project.tile || []).forEach((technology) => {
    const projectTechnology = normalize(technology);
    const skillKeys = projectTechnologyAliases[projectTechnology] || [projectTechnology];

    skillKeys.forEach((skillKey) => {
      const projectMatches = matches.get(skillKey) || [];

      if (!projectMatches.some((match) => match.title === project.title)) {
        projectMatches.push(project);
      }

      matches.set(skillKey, projectMatches);
    });
  });

  return matches;
}, new Map());

const getProjectsForSkill = (skill) => projectsBySkill.get(normalize(skill)) || [];
const getEmployersForSkill = (skill) => employersBySkill[normalize(skill)] || [];

export { getEmployersForSkill, getProjectsForSkill };
