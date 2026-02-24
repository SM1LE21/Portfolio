'use client';

import React from 'react';

interface HeroProps {
  name: string;
  tagline: string;
}

const Hero: React.FC<HeroProps> = ({ name, tagline }) => {
  const chars = name.split('');
  const taglineDelay = chars.length * 40 + 300;

  return (
    <section className="hero" id="hero">
      <h1 className="hero-name" aria-label={name}>
        {chars.map((char, i) => (
          <span
            key={i}
            className={char === ' ' ? 'hero-char hero-space' : 'hero-char'}
            style={{ animationDelay: `${i * 40}ms` }}
            aria-hidden="true"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        ))}
      </h1>
      <p
        className="hero-tagline"
        style={{ animationDelay: `${taglineDelay}ms` }}
      >
        {tagline}
      </p>
    </section>
  );
};

export default Hero;
