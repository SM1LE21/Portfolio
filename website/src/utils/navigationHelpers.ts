// src/utils/navigationHelpers.ts

import { NavigateFunction, Location } from 'react-router-dom';

export const navigateToSection = (
  sectionName: string,
  navigate: NavigateFunction,
  location: Location
) => {
  const sectionId = getSectionIdFromName(sectionName);

  // If the user is not on the home page, navigate to home first
  if (location.pathname !== '/') {
    navigate('/');
    // Wait for the navigation to complete before scrolling
    setTimeout(() => {
      scrollToSection(sectionId);
    }, 100);
  } else {
    scrollToSection(sectionId);
  }
};

export const scrollToSection = (sectionId: string) => {
  const sectionElement = document.getElementById(sectionId);
  if (sectionElement) {
    sectionElement.scrollIntoView({ behavior: 'smooth' });
  } else {
    console.warn(`Section with ID '${sectionId}' not found`);
  }
};

export const getSectionIdFromName = (sectionName: string): string => {
  const mapping: { [key: string]: string } = {
    about: 'about',
    projects: 'projects',
    experience: 'experience',
    certificates: 'certificates',
    education: 'education',
    // Add more sections here when adding them to the website
  };
  return mapping[sectionName.toLowerCase()] || '';
};
