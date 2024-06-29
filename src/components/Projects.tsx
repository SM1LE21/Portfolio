import React from 'react';

interface Project {
  title: string;
  description: string;
  link: string;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  return (
    <section id="projects">
      <h2>PROJECTS</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <a key={index} href={project.link} className="project-item">
            <h3>{project.title}</h3>
            <p>{project.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
};

export default Projects;
