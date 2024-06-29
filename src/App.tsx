import React, { useEffect } from 'react';
import Header from './components/Header';
import ExperienceSection from './components/ExperienceSection';
import EducationSection from './components/EducationSection';
import SkillsSection from './components/SkillsSection';
import ProjectsSection from './components/ProjectsSection';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './styles/index.css';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  useEffect(() => {
    gsap.from('.profile-pic', {
      duration: 1,
      opacity: 0,
      x: -50,
      ease: 'power3.out'
    });

    gsap.from('h1, .subtitle', {
      duration: 1,
      opacity: 0,
      y: 50,
      stagger: 0.2,
      ease: 'power3.out'
    });

    gsap.from('nav a', {
      duration: 1,
      opacity: 0,
      y: 20,
      stagger: 0.1,
      ease: 'power3.out'
    });

    gsap.from('.section', {
      duration: 1,
      opacity: 0,
      y: 50,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.section',
        start: 'top 80%'
      }
    });

    gsap.from('.project-card', {
      duration: 0.8,
      opacity: 0,
      y: 30,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.projects',
        start: 'top 70%'
      }
    });
  }, []);

  return (
    <div className="container">
      <Header />
      <ExperienceSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
    </div>
  );
};

export default App;
