/*
 * ContentSection.tsx
 * For projects with a title, image, and description or video
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';

interface ContentProps {
  title?: string;
  image?: string;
  description?: string; 
  video?: string;
}

const ContentSection: React.FC<ContentProps> = ({ title, image, description, video }) => {
  const noDescription = !description;

  return (
    <div className={`content-section ${noDescription ? 'no-description' : ''}`}>
      {title && <h3 className="content-title">{title}</h3>}
      {video ? (
        <video autoPlay loop muted playsInline className="content-media">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        image && <img src={image} alt="Project content" className="content-media" />
      )}
      {description && (
        <ReactMarkdown className={`content-description ${!image && !video ? 'full-width' : ''}`}>
          {Array.isArray(description) ? description.join('\n\n') : description}
        </ReactMarkdown>
      )}
    </div>
  );
};

export default ContentSection;
