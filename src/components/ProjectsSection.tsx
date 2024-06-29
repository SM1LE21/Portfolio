import React from 'react';

const projects = [
  {
    title: 'dyve.agency',
    description: 'Dyve.agency is a digital agency providing web development, digital marketing, branding, and content creation services to help businesses succeed online.',
    keywords: ['Web Development', 'Digital Marketing', 'Branding', 'Content Creation', 'React', 'Tailwind CSS', 'Storyblok', 'Node.js', 'Express.js', 'Vercel']
  },
  {
    title: 'EcoShop',
    description: 'EcoShop is an e-commerce platform focused on sustainable and eco-friendly products, offering a seamless shopping experience with a commitment to environmental responsibility.',
    keywords: ['E-commerce', 'Sustainable Products', 'Eco-friendly', 'React', 'Next.js', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Stripe']
  },
  {
    title: 'FitLife',
    description: 'FitLife is a health and fitness app that provides personalized workout plans, nutrition tracking, and community support to help users achieve their fitness goals.',
    keywords: ['Health and Fitness', 'Workout Plans', 'Nutrition Tracking', 'React Native', 'Redux', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'Firebase']
  },
  {
    title: 'LearnOnline',
    description: 'LearnOnline is an educational platform offering a wide range of online courses, interactive tutorials, and certifications to support lifelong learning and professional development.',
    keywords: ['Educational Platform', 'Online Courses', 'Interactive Tutorials', 'React', 'GraphQL', 'Tailwind CSS', 'Node.js', 'Express.js', 'PostgreSQL', 'AWS']
  },
  {
    title: 'TravelBuddy',
    description: 'TravelBuddy is a travel planning app that helps users create personalized itineraries, discover new destinations, and book accommodations and activities seamlessly.',
    keywords: ['Travel Planning', 'Personalized Itineraries', 'Destination Discovery', 'React Native', 'GraphQL', 'Tailwind CSS', 'Node.js', 'Express.js', 'MongoDB', 'Google Maps API']
  }
];

const ProjectsSection: React.FC = () => (
  <section id="projects" className="section">
    <h2>Projects</h2>
    <div className="projects">
      {projects.map((project, index) => (
        <div className="project-card" key={index}>
          <h3>{project.title}</h3>
          <p>{project.description}</p>
          <div className="project-keywords">
            {project.keywords.map(keyword => (
              <span className="project-keyword" key={keyword}>{keyword}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default ProjectsSection;
