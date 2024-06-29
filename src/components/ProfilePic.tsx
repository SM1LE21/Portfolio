import React from 'react';

interface ProfilePicProps {
  src: string;
  alt: string;
}

const ProfilePic: React.FC<ProfilePicProps> = ({ src, alt }) => (
  <img src={src} alt={alt} className="profile-pic" />
);

export default ProfilePic;
