// src/pages/AboutPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-content">
          <div className="about-header">
            <h1>About the Developer</h1>
            <div className="red-accent-line"></div>
          </div>

          <div className="about-main">
            <div className="creator-intro">
              <h2>Hi, I'm <span className="red-highlight">Umair Khan</span></h2>
              <p className="creator-title">
                <span className="red-highlight">Founding Engineer</span> | CS First Class Honors | International Hackathon Winner
              </p>
              
              <div className="creator-description">
                <p>
                  Welcome to QuranHub! I'm a <span className="red-highlight">founding engineer</span> with a <span className="red-highlight">First Class Honors</span> degree 
                  in Computer Science and winner of the <span className="red-highlight">Minimax International Hackathon</span>.
                </p>
                
                <p>
                  This project was developed as part of my assessment for the Quran team, where I aimed to 
                  create an <span className="red-highlight">intelligent and emotionally responsive</span> platform for people to connect with 
                  the Holy Quran through modern technology.
                </p>

                <p>
                  I specialize in building <span className="red-highlight">scalable applications</span> with clean architecture 
                  and user-centric design. My passion is creating solutions that make a <span className="red-highlight">meaningful impact</span>.
                </p>
              </div>
            </div>

            

            <div className="connect">
              <h3>Let's Connect</h3>
              <p>
                For more of my work and to discuss potential collaborations:
              </p>
              <div className="social-links-large">
                <a href="https://github.com/umairrrkhan" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="link-text">View My GitHub</span>
                  <span className="link-arrow">→</span>
                </a>
                <a href="https://www.linkedin.com/in/umairkhannn/" target="_blank" rel="noopener noreferrer" className="social-link">
                  <span className="link-text">Connect on LinkedIn</span>
                  <span className="link-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;