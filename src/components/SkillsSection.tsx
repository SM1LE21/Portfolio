import React from 'react';

const SkillsSection: React.FC = () => (
  <section id="skills" className="section">
    <h2>Skills</h2>
    <div className="skills">
      {['Software Development', 'Python', 'C/C++', 'Java', 'TypeScript', 'HTML/CSS', 'React', 'Angular', 'Vue.js/Svelte', 'Git/GitHub', 'Responsive Design', 'Information Architecture', 'Storyboarding', 'Wireframing', 'Usability Testing', 'Conceptual Modeling', 'Figma', 'Adobe XD, Photoshop'].map(skill => (
        <span className="skill" key={skill}>{skill}</span>
      ))}
    </div>
  </section>
);

export default SkillsSection;
