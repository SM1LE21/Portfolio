/*
 * Projects.tsx 
 * The component for displaying the projects on the landing page
 * It takes an array of projects and displays them in a grid
 * Each project has a title, description, and an image or video
 * The project title is used to generate a link to the project page
 */

import React from 'react';
import Link from 'next/link';

interface Project {
  title: string;
  description: string;
  image?: string;
  video?: string;
}

interface ProjectsProps {
  projects: Project[];
}

const Projects: React.FC<ProjectsProps> = ({ projects }) => {
  const isYouTubeUrl = (url: string) => url.includes('youtube.com') || url.includes('youtu.be');

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.includes('v=') ? url.split('v=')[1]?.split('&')[0] : url.split('/').pop();
    return `https://www.youtube.com/embed/${videoId}`;
  };

  return (
    <section id="projects">
      <h2>PROJECTS</h2>
      <div className="projects-grid">
        {projects.map((project, index) => {
          const isYouTube = project.video && isYouTubeUrl(project.video);

          // currently deactivated youtube videos in this preview
          return (
            <div key={index} className="project-item">
              {(project.video && !isYouTubeUrl(project.video)) ? (
                <div className={`project-background ${isYouTube ? 'youtube-video' : ''}`}>
                  {isYouTube ? (
                    <iframe
                      width="560"
                      height="315"
                      src={getYouTubeEmbedUrl(project.video)}
                      title={project.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <video autoPlay loop muted playsInline>
                      <source src={project.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              ) : (
                project.image && (
                  <div className="project-background" style={{ backgroundImage: `url(${project.image})` }}></div>
                )
              )}
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
              </div>
              <Link href={`/project/${project.title.toLowerCase().replace(/\s+/g, '-')}`} className="landingpage-project-link" />
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Projects;
