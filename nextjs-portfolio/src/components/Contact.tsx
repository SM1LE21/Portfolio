import React from 'react';

interface SocialLink {
  title: string;
  url: string;
  icon: string;
}

interface ContactProps {
  socialLinks: SocialLink[];
}

const Contact: React.FC<ContactProps> = ({ socialLinks }) => {
  return (
    <section id="contact">
      <h2>Connect</h2>
      <p className="contact-copy">
        Interested in what I&apos;m building? Let&apos;s connect.
      </p>
      <div className="social-links">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link"
            aria-label={link.title}
          >
            <img src={link.icon} alt={link.title} />
          </a>
        ))}
      </div>
    </section>
  );
};

export default Contact;
