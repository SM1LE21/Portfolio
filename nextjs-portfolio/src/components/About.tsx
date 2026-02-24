'use client';

import React from 'react';

interface AboutParagraph {
  text: string;
}

interface AboutProps {
  paragraphs: AboutParagraph[];
}

/**
 * Renders text with *italic* markdown-style markers as <em> elements.
 */
function renderWithEmphasis(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return part;
  });
}

const About: React.FC<AboutProps> = ({ paragraphs }) => {
  return (
    <section id="about">
      <h2>About</h2>
      <div className="about-story">
        {paragraphs.map((para, index) => (
          <p key={index}>{renderWithEmphasis(para.text)}</p>
        ))}
      </div>
    </section>
  );
};

export default About;
