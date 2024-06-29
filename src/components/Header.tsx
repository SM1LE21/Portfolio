import React from 'react';
import ProfilePic from './ProfilePic';
import Nav from './Nav';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => (
  <header>
    <ProfilePic src="https://i.imgur.com/uPN7xHh.jpg" alt="Tun Keltesch" />
    <div>
      <h1>Tun Keltesch</h1>
      <p className="subtitle">Software Engineer</p>
    </div>
    <Nav />
    <ThemeToggle />
  </header>
);

export default Header;
