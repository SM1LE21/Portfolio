/*
 * Section.tsx
 * The component for displaying a section with a title and content
 * It can also display a timeline of items
 * The component is used in About and Experience
 */

import React from 'react';

interface PreviousRole {
  title: string;
  date: string;
}

interface TimelineItem {
  date?: string;
  jobTitle: string;
  jobTitleDate?: string;
  previousRoles?: PreviousRole[];
  title_link?: string;
  company?: string;
  company_link?: string;
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
          {timelineItems.map((item, index) => {
            const isPromotion = index > 0 && 
              timelineItems[index - 1]?.company === item.company && 
              timelineItems[index - 1]?.company_link === item.company_link;
            
            return (
            <div key={index} className={`timeline-item ${isPromotion ? 'promotion-item' : ''}`}>
              {item.date && <div className="date">{item.date}</div>}
              {isPromotion && (
                <div className="promotion-badge">Promoted</div>
              )}
              
              {/* Current Job Title with Date */}
              <div className="job-title-container">
                {item.title_link ? (
                  <div className="job-title">
                    <a href={item.title_link} className="title-link" target="_blank" rel="noopener noreferrer">
                      {item.jobTitle}
                    </a>
                  </div>
                ) : (
                  <div className="job-title">{item.jobTitle}</div>
                )}
                {item.jobTitleDate && (
                  <div className="job-title-date">{item.jobTitleDate}</div>
                )}
              </div>

              {/* Previous Roles */}
              {item.previousRoles && item.previousRoles.length > 0 && (
                <div className="previous-roles">
                  {item.previousRoles.map((role, roleIndex) => (
                    <div key={roleIndex} className="previous-role">
                      <div className="previous-role-title">{role.title}</div>
                      <div className="previous-role-date">{role.date}</div>
                    </div>
                  ))}
                </div>
              )}

              {item.company && item.company_link ? (
                <div className="company">
                  <a href={item.company_link} className="company-link" target="_blank" rel="noopener noreferrer">
                    {item.company}
                  </a>
                </div>
              ) : (
                item.company && <div className="company">{item.company}</div>
              )}
              {item.description && <div className="description">{item.description}</div>}
              {item.skills && (
                <div className="skills">
                  {item.skills.map(skill => (
                    <span key={skill} className="skill">{skill}</span>
                  ))}
                </div>
              )}
            </div>
          )})}
        </div>
      )}
    </section>
  );
};

export default Section;
