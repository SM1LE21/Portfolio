import React from 'react';

interface TkMediaProps {
  title: string;
  subtitle: string;
  description: string;
  link: string;
  linkText: string;
}

const TkMedia: React.FC<TkMediaProps> = ({ title, subtitle, description, link, linkText }) => {
  return (
    <section id="tkmedia">
      <p className="tkmedia-subtitle">{subtitle}</p>
      <h2>{title}</h2>
      <p className="tkmedia-description">{description}</p>
      <a href={link} target="_blank" rel="noopener noreferrer" className="arrow-link">
        {linkText} <span aria-hidden="true">&rarr;</span>
      </a>
    </section>
  );
};

export default TkMedia;
