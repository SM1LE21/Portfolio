import React from 'react';

interface Experiment {
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  link: string;
  linkType: string;
}

interface ExperimentSectionProps {
  experiment: Experiment;
}

const ExperimentSection: React.FC<ExperimentSectionProps> = ({ experiment }) => {
  const linkLabel =
    experiment.linkType === 'github' ? 'View on GitHub' :
    experiment.linkType === 'internal' ? 'View project' :
    'Try it live';

  const isExternal = experiment.linkType !== 'internal';

  return (
    <div className="experiment-item">
      <div className="experiment-header">
        <h3 className="experiment-name">{experiment.name}</h3>
      </div>
      <p className="experiment-tagline">{experiment.tagline}</p>
      <p className="experiment-description">{experiment.description}</p>
      <div className="experiment-footer">
        <div className="experiment-tech">
          {experiment.tech.map((t, index) => (
            <span key={index}>{t}</span>
          ))}
        </div>
        <a
          href={experiment.link}
          {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          className="experiment-link"
        >
          {linkLabel} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
};

export default ExperimentSection;
