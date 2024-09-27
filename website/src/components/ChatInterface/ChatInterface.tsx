// src/components/ChatInterface/ChatInterface.tsx

import React, { useState, useEffect, ChangeEvent, KeyboardEvent, useRef } from 'react';
import { initializeSession, sendMessage, getConfig, Message as ApiMessage } from '../../utils/api';
import FeedbackForm from '../FeedbackForm';
import CookieConsent from '../CookieConsent';
import ChatIcon from '../ChatIcon';
import './ChatInterface.css';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useNavigate, useLocation } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content?: string;
  function_call?: {
    name: string;
    arguments: any;
  };
}

const ChatInterface: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [consentGiven, setConsentGiven] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();

  useGSAP(() => {
    if (isChatOpen && chatRef.current) {
      const screenHeight = window.innerHeight;
      const isSmallScreen = window.innerWidth <= 600;
      const targetHeight = isSmallScreen ? `${screenHeight}px` : '500px';

      gsap.fromTo(
        chatRef.current,
        { height: 0, opacity: 0 },
        { duration: 0.5, height: targetHeight, opacity: 1 }
      );
    }
  }, [isChatOpen]);

  // Check for cookie consent
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setConsentGiven(true);
    }
  }, []);

  // Initialize session after consent is given
  useEffect(() => {
    if (!consentGiven) return;

    const storedSessionId = localStorage.getItem('sessionId');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const storedMessages = localStorage.getItem('messages');
    const now = new Date().getTime();

    if (storedSessionId && sessionTimestamp && now - parseInt(sessionTimestamp, 10) < 30 * 60 * 1000) {
      setSessionId(storedSessionId);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } else {
      initializeSession()
        .then((data) => {
          setSessionId(data.session_id);
          localStorage.setItem('sessionId', data.session_id);
          localStorage.setItem('sessionTimestamp', now.toString());
        })
        .catch((error) => {
          console.error('Error initializing session:', error);
          setError('Failed to initialize session. Please try again later.');
        });
    }
  }, [consentGiven]);

  // Save messages to local storage
  useEffect(() => {
    if (consentGiven) {
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  }, [messages, consentGiven]);

  // Fetch configuration from backend
  useEffect(() => {
    getConfig()
      .then((config) => {
        setShowFeedback(config.showFeedback);
      })
      .catch((error) => {
        console.error('Error fetching configuration:', error);
        // Handle error if needed
      });
  }, []);

  const isSessionValid = () => {
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    const now = new Date().getTime();
    return sessionTimestamp && now - parseInt(sessionTimestamp, 10) < 30 * 60 * 1000;
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!isSessionValid()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'system', content: 'Session expired. Please refresh the page.' },
      ]);
      return;
    }

    const userMessage: Message = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      if (!sessionId) throw new Error('Session ID is not set.');
      const response = await sendMessage(sessionId, input);

      // Create the assistant message
      const aiMessage: Message = {
        role: 'assistant',
        content: response.content,
        function_call: response.function_call,
      };

      // Handle function call if present
      if (!response.function_call) {
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        aiMessage.content = "Navigating to " + response.function_call.arguments.section_name + " section...";
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
        handleFunctionCall(response.function_call);
      }

      // Update session timestamp on successful interaction
      const now = new Date().getTime();
      localStorage.setItem('sessionTimestamp', now.toString());
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error sending message:', error);
        setError(error.response?.data?.detail || 'Failed to send message. Please try again later.');
      } else {
        console.error('Unexpected error:', error);
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFunctionCall = (functionCall: { name: string; arguments: any }) => {
    switch (functionCall.name) {
      case 'provide_info_and_navigate':
        // Display the info as an assistant message
        if (functionCall.arguments.info) {
          const infoMessage: Message = {
            role: 'assistant',
            content: functionCall.arguments.info,
          };
          setMessages((prevMessages) => [...prevMessages, infoMessage]);
        }
        // Navigate to the section
        if (functionCall.arguments.section_name) {
          navigateToSection(functionCall.arguments.section_name);
        }
        break;
      // Add cases for other functions in the future
      default:
        console.warn(`Unhandled function: ${functionCall.name}`);
    }
  };

  const navigateToSection = (sectionName: string) => {
    const sectionId = getSectionIdFromName(sectionName);
  
    // If the user is not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for the navigation to complete before scrolling
      setTimeout(() => {
        scrollToSection(sectionId);
      }, 100);
    } else {
      scrollToSection(sectionId);
    }
  };

  const scrollToSection = (sectionId: string) => {
    const sectionElement = document.getElementById(sectionId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      console.warn(`Section with ID '${sectionId}' not found`);
    }
  };

  const getSectionIdFromName = (sectionName: string): string => {
    const mapping: { [key: string]: string } = {
      about: 'about',
      projects: 'projects',
      experience: 'experience',
      certificates: 'certificates',
      education: 'education',
      // Add more sections here when adding them to the website
    };
    return mapping[sectionName.toLowerCase()] || '';
  };

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!loading) handleSend();
    }
  };

  const handleAcceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setConsentGiven(true);
  };

  const handleNewChat = () => {
    // Clear messages and initialize a new session
    setMessages([]);
    setInput('');
    localStorage.removeItem('sessionId');
    localStorage.removeItem('sessionTimestamp');
    localStorage.removeItem('messages');

    initializeSession()
      .then((data) => {
        setSessionId(data.session_id);
        const now = new Date().getTime();
        localStorage.setItem('sessionId', data.session_id);
        localStorage.setItem('sessionTimestamp', now.toString());
      })
      .catch((error) => {
        console.error('Error initializing new session:', error);
        setError('Failed to start a new chat. Please try again later.');
      });
  };

  const toggleChat = () => {
    if (isChatOpen) {
      // Close chat with animation
      gsap.to(chatRef.current, {
        duration: 0.5,
        height: 0,
        opacity: 0,
        onComplete: () => setIsChatOpen(false),
      });
    } else {
      setIsChatOpen(true);
      // Scroll to bottom when chat opens
      setTimeout(() => {
        if (chatRef.current) {
          chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
      }, 100);
    }
  };

  const openFeedback = () => {
    setIsFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setIsFeedbackOpen(false);
  };

  const handleFeedbackSubmitted = () => {
    setFeedbackSubmitted(true);
  };

  return (
    <div>
      {!consentGiven && <CookieConsent onAccept={handleAcceptCookies} />}

      {consentGiven && (
        <>
          {!isChatOpen && <ChatIcon onClick={toggleChat} />} {/* Display chat icon when chat is closed */}

          {isChatOpen && (
            <div className="chat-interface" ref={chatRef}>
              <div className="chat-header">
                <span>TK Chat: Curious about me? Ask away!</span>
                <button className="close-button" onClick={toggleChat} aria-label="Close Chat">
                  ✖
                </button>
              </div>
              <div className="messages">
                {messages.map((msg, index) => (
                  <div key={index} className={`message ${msg.role}`}>
                    <div className="message-content">
                      {/* Render message content as Markdown */}
                      {msg.role === 'assistant' ? (
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content || ''}
                        </ReactMarkdown>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}
                {loading && <div className="loading">AI is typing...</div>}
              </div>
              {error && <div className="error-message">{error}</div>}
              <div className="input-area">
                <textarea
                  value={input}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                  placeholder="Type your message..."
                />
                <button onClick={handleSend} disabled={loading || !input.trim()} className="send-button">
                  <FontAwesomeIcon icon={faPaperPlane} />
                </button>
              </div>
              <div className="chat-footer">
                <button onClick={handleNewChat} className="new-chat-button">
                  New Chat
                </button>
                <button
                  onClick={!feedbackSubmitted ? openFeedback : undefined}
                  className={`feedback-button ${feedbackSubmitted ? 'disabled' : ''}`}
                  disabled={feedbackSubmitted}
                >
                  {feedbackSubmitted ? 'Thank You' : 'Give Feedback'}
                </button>
              </div>

              {/* Feedback modal */}
              {isFeedbackOpen && (
                <div className="feedback-modal">
                  <div className="feedback-modal-content">
                    <button className="close-feedback" onClick={closeFeedback} aria-label="Close Feedback Form">
                      ✖
                    </button>
                    {sessionId && (
                      <FeedbackForm sessionId={sessionId} onClose={closeFeedback} handleFeedback={handleFeedbackSubmitted} />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChatInterface;
