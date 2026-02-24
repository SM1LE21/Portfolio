'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import data from '../data/data.json';
import Hero from '../components/Hero';
import About from '../components/About';
import TkMedia from '../components/TkMedia';
import ProductCard from '../components/ProductCard';
import ExperimentSection from '../components/ExperimentSection';
import NowAndNext from '../components/NowAndNext';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import WaveToggle from '../components/WaveToggle';

export default function HomePage() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  const onScroll = useCallback(() => {
    rafRef.current = requestAnimationFrame(() => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;

      // Scroll progress bar
      if (progressRef.current) {
        const progress = docHeight > winHeight
          ? (scrollTop / (docHeight - winHeight)) * 100
          : 0;
        progressRef.current.style.width = `${progress}%`;
      }

      // Hero name shrink/fade
      if (heroRef.current) {
        const heroHeight = heroRef.current.offsetHeight;
        const heroScroll = Math.min(scrollTop / (heroHeight * 0.5), 1);
        heroRef.current.style.setProperty('--hero-scroll', heroScroll.toString());
      }

      // Section headings parallax
      if (wrapperRef.current) {
        const headings = wrapperRef.current.querySelectorAll<HTMLElement>('[data-parallax]');
        headings.forEach((heading) => {
          const rect = heading.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const offset = (center - winHeight / 2) * 0.08;
          heading.style.transform = `translateY(${offset}px)`;
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!wrapperRef.current) return;

    heroRef.current = wrapperRef.current.querySelector('#hero');

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Fade-in observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.15 }
    );

    const fadeElements = wrapperRef.current.querySelectorAll('.fade-in');
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [onScroll]);

  return (
    <>
      <div className="scroll-progress" ref={progressRef} />
      <div className="site-wrapper" ref={wrapperRef}>

        {/* HERO */}
        <div className="snap-section">
          <Hero name={data.name} tagline={data.tagline} />
        </div>

        {/* ABOUT */}
        <div className="snap-section fade-in">
          <About paragraphs={data.about.paragraphs} />
        </div>

        {/* TK MEDIA */}
        <div className="snap-section fade-in">
          <TkMedia
            title={data.tkMedia.title}
            subtitle={data.tkMedia.subtitle}
            description={data.tkMedia.description}
            link={data.tkMedia.link}
            linkText={data.tkMedia.linkText}
          />
        </div>

        {/* PRODUCTS */}
        <div className="snap-section fade-in" id="products">
          <div className="snap-section-inner">
            <h2 data-parallax>Products</h2>
            <div className="products-grid">
              {data.products.map((product, index) => (
                <ProductCard key={index} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* EXPERIMENTS */}
        <div className="snap-section fade-in" id="experiments">
          <div className="snap-section-inner">
            <h2 data-parallax>Experiments & Tools</h2>
            <p className="experiments-intro">
              A couple of noteworthy tools I built along the way.
            </p>
            {data.experiments.map((experiment, index) => (
              <ExperimentSection key={index} experiment={experiment} />
            ))}
          </div>
        </div>

        {/* NOW & NEXT + CONTACT + FOOTER */}
        <div className="snap-section snap-section-end fade-in">
          <div className="snap-section-inner">
            <NowAndNext items={data.nowAndNext} />
            <div className="closing-spacer" />
            <Contact socialLinks={data.socialLinks} />
          </div>
          <Footer />
        </div>

      </div>
      <WaveToggle />
    </>
  );
}
