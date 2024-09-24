// TK CHAT INTEGRATION
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import './ChatIcon.css';

interface ChatIconProps {
  onClick: () => void;
}

const ChatIcon: React.FC<ChatIconProps> = ({ onClick }) => {
  const [showGlow, setShowGlow] = useState(false);

  // Toggle glow effect every 10 seconds
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setShowGlow((prev) => !prev);
    }, 10000);

    return () => clearInterval(glowInterval);
  }, []);

  return (
    <>
      {showGlow && <div className="chat-glow"></div>}
      <div className="chat-icon" onClick={onClick}>
        <FontAwesomeIcon icon={faComment} className="chat-icon-symbol" />
      </div>
    </>
  );
};

export default ChatIcon;
