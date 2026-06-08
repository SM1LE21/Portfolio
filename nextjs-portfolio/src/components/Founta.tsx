import React from 'react';

interface FountaProof {
  prefix?: string;
  linkText?: string;
  link?: string;
  suffix?: string;
}

interface FountaProps {
  title: string;
  subtitle: string;
  description: string;
  proof?: FountaProof;
  link?: string;
  linkText: string;
}

const Founta: React.FC<FountaProps> = ({ title, subtitle, description, proof, link, linkText }) => {
  return (
    <section id="founta">
      <p className="tkmedia-subtitle">{subtitle}</p>
      <h2>{title}</h2>
      <p className="tkmedia-description">{description}</p>
      {proof && (
        <p className="founta-proof">
          {proof.prefix}
          {proof.link ? (
            <a href={proof.link} target="_blank" rel="noopener noreferrer">
              {proof.linkText}
            </a>
          ) : (
            proof.linkText
          )}
          {proof.suffix}
        </p>
      )}
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
