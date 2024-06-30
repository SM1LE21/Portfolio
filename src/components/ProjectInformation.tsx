import React from 'react';
import { useParams } from 'react-router-dom';
import data from '../data.json';
import ContentSection from './ContentSection';

interface Content {
  title?: string;
  image?: string;
  description: string;
  video?: string;
}

interface Project {
  title: string;
  description: string;
  big_description: string[];
  github_link?: string;
  link?: string;
  link_text?: string;
  image?: string;
  video?: string;
  skills?: string[];
  showMainMedia: boolean;
  content: Content[];
}

const ProjectInformation: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const project = data.projects.find(proj => proj.title.toLowerCase().replace(/\s+/g, '-') === projectId) as Project | undefined;

  if (!project) {
    return <div>Project not found</div>;
  }

  const githubIcon = data.socialLinks.find(link => link.title === 'GitHub')?.icon;

  return (
    <div className="project-info-container">
      <h1>{project.title}</h1>
      {project.big_description.map((paragraph, index) => (
        <p key={index} className="big-description">{paragraph}</p>
      ))}
      {project.github_link && (
        <p className="project-github-link">
          <a href={project.github_link} target="_blank" rel="noopener noreferrer">
            <img src={githubIcon} alt="GitHub" className="icon" /> Check out the project on GitHub
          </a>
        </p>
      )}
      {project.link && project.link_text && (
        <p className="project-link">
          <a href={project.link} target="_blank" rel="noopener noreferrer">{project.link_text}</a>
        </p>
      )}
      {project.skills && (
        <div className="skills">
          {project.skills.map((skill, index) => (
            <span key={index} className="skill">{skill}</span>
          ))}
        </div>
      )}
      {project.showMainMedia && (
        project.video ? (
          <video autoPlay loop muted className="main-media">
            <source src={project.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          project.image && <img src={project.image} alt={project.title} className="main-media" />
        )
      )}
      <div className="content">
        {project.content.map((section, index) => (
          <ContentSection
            key={index}
            title={section.title}
            image={section.image}
            description={section.description}
            video={section.video}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectInformation;
