'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

const RIPPLE_SELECTORS = '.snap-section, .product-card, .experiment-item, footer, .social-link';
const MAX_DELAY = 600;
const BLUR_DURATION = 300;

const WaveToggle: React.FC = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    // Read actual theme state set by the blocking script in layout.tsx
    const isLight = document.documentElement.dataset.theme === 'light';
    setIsLightMode(isLight);
  }, []);

  const getElementCenter = (el: Element) => {
    const rect = el.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  };

  const toggle = useCallback(() => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const btn = btnRef.current;
    if (!btn) return;

    const newMode = !isLightMode;
    const btnCenter = getElementCenter(btn);

    // Get all transitionable elements
    const elements = document.querySelectorAll(RIPPLE_SELECTORS);

    // Calculate distances and normalize
    const withDistance = Array.from(elements).map((el) => {
      const center = getElementCenter(el);
      const dist = Math.hypot(center.x - btnCenter.x, center.y - btnCenter.y);
      return { el, dist };
    });

    const maxDist = Math.max(...withDistance.map((e) => e.dist), 1);

    // Set ripple delays on each element
    withDistance.forEach(({ el, dist }) => {
      const delay = (dist / maxDist) * MAX_DELAY;
      (el as HTMLElement).style.setProperty('--ripple-delay', `${delay}ms`);
    });

    // Flip the theme — CSS variable transitions fire at staggered delays
    if (newMode) {
      document.documentElement.dataset.theme = 'light';
    } else {
      delete document.documentElement.dataset.theme;
    }
    setIsLightMode(newMode);
    localStorage.setItem('lightMode', newMode.toString());

    // Add blur to each element at its delay time
    withDistance.forEach(({ el, dist }) => {
      const delay = (dist / maxDist) * MAX_DELAY;
      setTimeout(() => {
        el.classList.add('ripple-blur');
        setTimeout(() => {
          el.classList.remove('ripple-blur');
        }, BLUR_DURATION);
      }, delay);
    });

    // Clean up after all animations complete
    setTimeout(() => {
      elements.forEach((el) => {
        (el as HTMLElement).style.removeProperty('--ripple-delay');
      });
      isAnimating.current = false;
    }, MAX_DELAY + BLUR_DURATION + 100);
  }, [isLightMode]);

  return (
    <button
      ref={btnRef}
      className="wave-toggle-btn"
      onClick={toggle}
      aria-label={isLightMode ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {isLightMode ? 'Dark Mode' : 'Light Mode'}
    </button>
  );
};

export default WaveToggle;
