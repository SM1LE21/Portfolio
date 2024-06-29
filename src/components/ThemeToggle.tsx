import React, { useState, useEffect } from 'react';

const ThemeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <button id="theme-toggle" onClick={() => setIsDarkMode(!isDarkMode)}>
      {isDarkMode ? '☀️' : '🌓'}
    </button>
  );
};

export default ThemeToggle;
