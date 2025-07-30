// src/components/CVTemplate.tsx
/**
 * Professional CV Template Component
 * Dynamically populated based on job-specific content selection
 */

import React from 'react';

interface CVTemplateProps {
  cvContent: {
    personal_info: {
      name: string;
      title: string;
      description: string;
    };
    experience: Array<{
      date: string;
      jobTitle: string;
      company: string;
      company_link?: string;
      description: string;
      skills: string[];
    }>;
    certificates: Array<{
      date: string;
      jobTitle: string;
      title_link?: string;
      company: string;
      description: string;
    }>;
    education: Array<{
      jobTitle: string;
      company: string;
      company_link?: string;
      description?: string;
    }>;
    skills: {
      [category: string]: string[];
    };
  };
  contactInfo?: {
    email: string;
    linkedin?: string;
    phone?: string;
    location?: string;
  };
  languages?: Array<{
    name: string;
    level: 'native' | 'fluent' | 'proficient' | 'intermediate' | 'basic';
  }>;
  profileImage?: string;
}

const CVTemplate: React.FC<CVTemplateProps> = ({ 
  cvContent, 
  contactInfo,
  languages,
  profileImage 
}) => {
  const formatSkillLevel = (level: string) => {
    const levels = {
      'native': 5,
      'fluent': 5,
      'proficient': 4,
      'intermediate': 3,
      'basic': 2,
      'beginner': 1
    };
    return levels[level as keyof typeof levels] || 3;
  };

  const renderSkillDots = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span
        key={i}
        className={`skill-dot ${i < level ? 'filled' : 'empty'}`}
      />
    ));
  };

  return (
    <div className="cv-template" id="cv-template">
      <div className="cv-left-column">
        {/* Profile Section */}
        <div className="cv-profile-section">
          {profileImage && (
            <div className="cv-profile-image">
              <img src={profileImage} alt={cvContent.personal_info.name} />
            </div>
          )}
          <div className="cv-profile-info">
            <h1 className="cv-name">{cvContent.personal_info.name}</h1>
            <h2 className="cv-title">{cvContent.personal_info.title}</h2>
          </div>
        </div>

        {/* Contact Section */}
        {contactInfo && (
          <div className="cv-section">
            <div className="cv-section-header">
              <div className="cv-section-icon">👤</div>
              <h3>Contact</h3>
            </div>
            <div className="cv-contact-info">
              <div className="cv-contact-item">
                <strong>E-mail</strong>
                <span>{contactInfo.email}</span>
              </div>
              {contactInfo.linkedin && (
                <div className="cv-contact-item">
                  <strong>LinkedIn</strong>
                  <a 
                    href={`https://${contactInfo.linkedin}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="cv-contact-link"
                  >
                    {contactInfo.linkedin}
                  </a>
                </div>
              )}
              {contactInfo.phone && (
                <div className="cv-contact-item">
                  <strong>Phone</strong>
                  <span>{contactInfo.phone}</span>
                </div>
              )}
              {contactInfo.location && (
                <div className="cv-contact-item">
                  <strong>Location</strong>
                  <span>{contactInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div className="cv-section">
          <div className="cv-section-header">
            <div className="cv-section-icon">💡</div>
            <h3>Skills</h3>
          </div>
          <div className="cv-skills">
            {Object.entries(cvContent.skills).map(([category, skills]) => (
              <div key={category} className="cv-skill-category">
                <h4 className="cv-skill-category-title">
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <div className="cv-skill-list">
                  {skills.map((skill, index) => (
                    <div key={index} className="cv-skill-item">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Languages Section */}
        {languages && languages.length > 0 && (
          <div className="cv-section">
            <div className="cv-section-header">
              <div className="cv-section-icon">🌐</div>
              <h3>Languages</h3>
            </div>
            <div className="cv-languages">
              {languages.map((lang, index) => (
                <div key={index} className="cv-language-item">
                  <div className="cv-language-name">
                    <strong>{lang.name}</strong>
                    {lang.level === 'native' && <span className="cv-native-tag">(nationality)</span>}
                  </div>
                  <div className="cv-language-level">
                    {renderSkillDots(formatSkillLevel(lang.level))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="cv-right-column">
        {/* Experience Section */}
        <div className="cv-section">
          <div className="cv-section-header">
            <div className="cv-section-icon">💼</div>
            <h3>Experience</h3>
          </div>
          <div className="cv-timeline">
            {cvContent.experience.map((exp, index) => (
              <div key={index} className="cv-timeline-item">
                <div className="cv-timeline-date">{exp.date}</div>
                <div className="cv-timeline-content">
                  <h4 className="cv-job-title">{exp.jobTitle}</h4>
                  <div className="cv-company">
                    at{' '}
                    {exp.company_link ? (
                      <a href={exp.company_link} target="_blank" rel="noopener noreferrer">
                        {exp.company}
                      </a>
                    ) : (
                      exp.company
                    )}
                  </div>
                  <p className="cv-job-description">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Education Section */}
        <div className="cv-section">
          <div className="cv-section-header">
            <div className="cv-section-icon">🎓</div>
            <h3>Education</h3>
          </div>
          <div className="cv-timeline">
            {cvContent.education.map((edu, index) => (
              <div key={index} className="cv-timeline-item">
                <div className="cv-timeline-content">
                  <h4 className="cv-degree-title">{edu.jobTitle}</h4>
                  <div className="cv-institution">
                    {edu.company_link ? (
                      <a href={edu.company_link} target="_blank" rel="noopener noreferrer">
                        {edu.company}
                      </a>
                    ) : (
                      edu.company
                    )}
                  </div>
                  {edu.description && (
                    <p className="cv-education-description">{edu.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certificates Section */}
        {cvContent.certificates.length > 0 && (
          <div className="cv-section">
            <div className="cv-section-header">
              <div className="cv-section-icon">🏆</div>
              <h3>Certificates</h3>
            </div>
            <div className="cv-timeline">
              {cvContent.certificates.map((cert, index) => (
                <div key={index} className="cv-timeline-item">
                  <div className="cv-timeline-content">
                    <h4 className="cv-certificate-title">
                      {cert.title_link ? (
                        <a href={cert.title_link} target="_blank" rel="noopener noreferrer">
                          {cert.jobTitle}
                        </a>
                      ) : (
                        cert.jobTitle
                      )}
                    </h4>
                    <div className="cv-certificate-provider">{cert.company}</div>
                    <p className="cv-certificate-description">{cert.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Portfolio Reference */}
        <div className="cv-footer">
          <p className="cv-portfolio-reference">
            Explore my portfolio for project highlights, professional experience, and additional certificates:{' '}
            <a 
              href="https://tnkeltesch.dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="cv-portfolio-link"
            >
              <strong>tnkeltesch.dev</strong>
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CVTemplate; 