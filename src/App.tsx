import React, { useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import data from './data.json';
import Sidebar from './components/Sidebar';
import Section from './components/Section';
import Projects from './components/Projects';
import Footer from './components/Footer';
import './App.css';
import { useGSAP } from '@gsap/react';

const App: React.FC = () => {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sidebarRef.current) {
      gsap.from(sidebarRef.current, { duration: 1, x: -50, opacity: 0, ease: "power3.out" });
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('section');
      gsap.from(sections, { duration: 1, y: 50, opacity: 0, stagger: 0.2, ease: "power3.out" });

      const timelineItems = sectionsRef.current.querySelectorAll('.timeline-item');
      timelineItems.forEach((item, index) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          },
          opacity: 0,
          x: -50,
          duration: 1.2,
          delay: index * 0.2
        });
      });
    }
  }, []);

  return (
    <>
      <div className="container">
        <aside className="sidebar" ref={sidebarRef}>
          <Sidebar name={data.name} title={data.title} description={data.description} socialLinks={data.socialLinks} />
        </aside>
        <main ref={sectionsRef}>
          <Section id="about" title="ABOUT">
            {data.about.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </Section>
          <Projects projects={data.projects} />
          <Section id="experience" title="EXPERIENCE" timelineItems={data.experience} />
          <Section id="education" title="EDUCATION" timelineItems={data.education} />
        </main>
      </div>
      <Footer />
    </>
  );
};

export default App;
