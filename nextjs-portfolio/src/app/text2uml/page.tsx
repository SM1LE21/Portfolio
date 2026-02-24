'use client';

import React from 'react';
import Link from 'next/link';

export default function Text2UMLPage() {
  return (
    <div className="subpage">
      <nav className="subpage-nav">
        <Link href="/" className="back-link">
          <span aria-hidden="true">&larr;</span> Back
        </Link>
      </nav>

      <header className="subpage-header">
        <p className="subpage-label">Experiment &middot; Bachelor&apos;s Thesis</p>
        <h1>Text2UML</h1>
        <p className="subpage-tagline">
          A VS Code extension that turns natural language into UML diagrams — built as my Bachelor&apos;s thesis at RWTH Aachen University.
        </p>
      </header>

      <section className="subpage-section">
        <h2>What it does</h2>
        <p>
          Text2UML automatically generates graphical UML representations from textual diagram descriptions.
          You write a diagram in a structured textual format, and the extension renders it live inside VS Code — no dragging boxes around, no switching tools.
        </p>
      </section>

      <section className="subpage-section">
        <h2>Sequence Diagram</h2>
        <div className="subpage-media">
          <video controls preload="metadata" playsInline>
            <source src="/assets/text2uml_SD.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="subpage-section">
        <h2>Activity Diagram</h2>
        <div className="subpage-media">
          <video controls preload="metadata" playsInline>
            <source src="/assets/text2uml.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="subpage-section">
        <h2>Architecture</h2>
        <p>
          Combines a Java-based Language Server Protocol backend (powered by MontiCore) with a React + D3.js visualization frontend. The LSP backend parses textual diagram descriptions and sends structured data to the frontend, which renders interactive UML diagrams in real time.
        </p>
        <div className="subpage-media">
          <img src="/assets/text2uml_frontendBackendCommunication.png" alt="Frontend-backend communication architecture" />
        </div>
        <div className="subpage-media">
          <img src="/assets/text2uml_visualizationWorkflow.png" alt="Visualization workflow" />
        </div>
      </section>

      <section className="subpage-section">
        <h2>Tech Stack</h2>
        <div className="subpage-tech">
          {['Java', 'TypeScript', 'React', 'D3.js', 'MontiCore', 'VS Code Extension API', 'Language Server Protocol'].map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
      </section>
    </div>
  );
}
