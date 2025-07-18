/*
 * ProjectInformation.tsx
 * The component for displaying information about a project
 * It takes the project ID from the URL and displays the project information
 * The component uses the data from the data.json file
 */

'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import data from '../data/data.json';
import ContentSection from './ContentSection';
import EmbeddedWebsite from './EmbeddedWebsite';
import ReactMarkdown from 'react-markdown';

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
  embedWebsite?: boolean;
  embedLink?: string;
}

const ProjectInformation: React.FC = () => {
  const params = useParams();
  const projectId = params?.projectId as string;
  const project = data.projects.find(proj => proj.title.toLowerCase().replace(/\s+/g, '-') === projectId) as Project | undefined;

  // Add useEffect to scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return <div>Project not found</div>;
  }

  const githubIcon = data.socialLinks.find(link => link.title === 'GitHub')?.icon;

  const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <div className="project-info-container">
      <Link href="/" className="back-to-home title-link">← Back to Home</Link>
      <h1>{project.title}</h1>
      {project.skills && (
        <div className="skills">
          {project.skills.map((skill, index) => (
            <span key={index} className="skill">{skill}</span>
          ))}
        </div>
      )}
      <div className="big-description">
        <ReactMarkdown>
          {project.big_description.join('\n\n')}
        </ReactMarkdown>
      </div>
      {project.github_link && (
        <p className="project-github-link">
          <a href={`https://${project.github_link}`} target="_blank" rel="noopener noreferrer" className="title-link">
            <img src={githubIcon} alt="GitHub" className="icon" /> Check out the project on GitHub
          </a>
        </p>
      )}
      {project.link && project.link_text && (
        <p className="project-link">
          <a href={`https://${project.link}`} target="_blank" rel="noopener noreferrer" className="title-link">{project.link_text}</a>
        </p>
      )}
      {project.showMainMedia && (
        project.video ? (
          isYouTubeUrl(project.video) ? (
            <iframe
              width="560"
              height="315"
              src={getYouTubeEmbedUrl(project.video)}
              title={project.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="main-media"
            ></iframe>
          ) : (
            <video autoPlay loop muted playsInline className="main-media">
              <source src={project.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )
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
      {project.embedWebsite && project.embedLink && (
        <EmbeddedWebsite url={`https://${project.embedLink}`} />
      )}
    </div>
  );
};

export default ProjectInformation;
