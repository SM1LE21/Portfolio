import React from 'react';

interface TimelineItem {
  date?: string;
  jobTitle: string;
  company?: string;
  description?: string;
  skills?: string[];
}

interface SectionProps {
  id: string;
  title: string;
  children?: React.ReactNode;
  timelineItems?: TimelineItem[];
}

const Section: React.FC<SectionProps> = ({ id, title, children, timelineItems }) => {
  return (
    <section id={id}>
      <h2>{title}</h2>
      {children}
      {timelineItems && (
        <div className="timeline">
          {timelineItems.map((item, index) => (
            <div key={index} className="timeline-item">
              {item.date && <div className="date">{item.date}</div>}
              <div className="job-title">{item.jobTitle}</div>
              {item.company && <div className="company">{item.company}</div>}
              {item.description && <div className="description">{item.description}</div>}
              {item.skills && (
                <div className="skills">
                  {item.skills.map(skill => (
                    <span key={skill} className="skill">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Section;
