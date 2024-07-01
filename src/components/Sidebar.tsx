import React from 'react';

interface SidebarProps {
  name: string;
  title: string;
  description: string;
  socialLinks: { title: string; url: string; icon: string }[];
  isLightMode: boolean;
  toggleLightMode: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ name, title, description, socialLinks, isLightMode, toggleLightMode }) => {
  return (
    <aside className="sidebar">
      <div className="name-highlight">
        <h1>{name}</h1>
        <div className="subtitle">{title}</div>
      </div>
      <p className="description">{description}</p>
      <div className="social-icons">
        {socialLinks.map(link => (
          <a key={link.title} href={link.url} title={link.title} target="_blank" rel="noopener noreferrer">
            <img src={link.icon} alt={link.title} />
          </a>
        ))}
      </div>
      <button 
        onClick={toggleLightMode} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer',
          fontSize: '24px',
          marginTop: '20px',
          padding: '0',
        }}
      >
        {isLightMode ? '🌒' : '☀️'}
      </button>
    </aside>
  );
};

export default Sidebar;
