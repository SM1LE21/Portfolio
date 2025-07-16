// src/utils/navigationHelpers.ts
// Adapted for Next.js App Router

export const navigateToSection = (
  sectionName: string,
  router: any, // Using any for now - will be typed when used with useRouter()
  pathname: string
) => {
  const sectionId = getSectionIdFromName(sectionName);

  // Function to scroll to section after navigation
  const scrollAfterNavigation = () => {
    const checkIfSectionExists = setInterval(() => {
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        clearInterval(checkIfSectionExists);
        sectionElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  if (pathname !== '/') {
    router.push('/');
    setTimeout(() => {
      scrollAfterNavigation();
    }, 100);
  } else {
    scrollAfterNavigation();
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