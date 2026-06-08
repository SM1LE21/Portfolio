import React from 'react';

interface FountaProps {
  title: string;
  subtitle: string;
  description: string;
  proof?: string;
  link?: string;
  linkText: string;
}

const Founta: React.FC<FountaProps> = ({ title, subtitle, description, proof, link, linkText }) => {
  return (
    <section id="founta">
      <p className="tkmedia-subtitle">{subtitle}</p>
      <h2>{title}</h2>
      <p className="tkmedia-description">{description}</p>
      {proof && <p className="founta-proof">{proof}</p>}
      {link ? (
        <a href={link} target="_blank" rel="noopener noreferrer" className="arrow-link">
          {linkText} <span aria-hidden="true">&rarr;</span>
        </a>
      ) : (
        <p className="founta-soon">{linkText}</p>
      )}
    </section>
  );
};

export default Founta;
