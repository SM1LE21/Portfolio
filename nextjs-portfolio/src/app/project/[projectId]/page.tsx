'use client';

import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import data from '../../../data/data.json';
import Sidebar from '../../../components/Sidebar';
import ProjectInformation from '../../../components/ProjectInformation';
import Footer from '../../../components/Footer';
import { useGSAP } from '@gsap/react';

import { usePathname } from 'next/navigation';

export default function ProjectPage() {
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const [isLightMode, setIsLightMode] = useState(false);
  const pathname = usePathname();
  const isProjectPage = pathname.startsWith('/project/');

  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (sidebarRef.current) {
      gsap.from(sidebarRef.current, 
        { 
          duration: 1.5, 
          x: -50, 
          opacity: 0, 
          ease: "power3.out" 
        }
      );
    }

    if (sectionsRef.current) {
      const sections = sectionsRef.current.querySelectorAll('section');
      gsap.from(sections, 
        { 
          duration: 1.2, 
          y: 50, 
          opacity: 0, 
          stagger: 0.2, 
          ease: "power3.out" 
        }
      );

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 0);
    }
  }, []);

  useLayoutEffect(() => {
    ScrollTrigger.refresh();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('light-mode', isLightMode);
  }, [isLightMode]);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <>
      <div className="wrapper">
        <div className="container">
          <aside className={`sidebar ${isProjectPage ? 'hide-on-mobile' : ''}`} ref={sidebarRef}>
            <Sidebar 
              name={data.name} 
              title={data.title} 
              description={data.description} 
              socialLinks={data.socialLinks} 
              isLightMode={isLightMode} 
              toggleLightMode={toggleLightMode} 
            />
          </aside>
          <main ref={sectionsRef}>
            <ProjectInformation />
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
} 