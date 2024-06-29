import React from 'react';

interface SidebarProps {
  name: string;
  title: string;
  description: string;
  socialLinks: { title: string; url: string }[];
}

const Sidebar: React.FC<SidebarProps> = ({ name, title, description, socialLinks }) => {
  return (
    <aside className="sidebar">
      <div className="name-highlight">
        <h1>{name}</h1>
        <div className="subtitle">{title}</div>
      </div>
      <p className="description">{description}</p>
      <nav>
        <ul>
          <li><a href="#about">ABOUT</a></li>
          <li><a href="#experience">EXPERIENCE</a></li>
          <li><a href="#education">EDUCATION</a></li>
        </ul>
      </nav>
      <div className="social-icons">
        {socialLinks.map(link => (
          <a key={link.title} href={link.url} title={link.title}>{link.title.charAt(0)}</a>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
