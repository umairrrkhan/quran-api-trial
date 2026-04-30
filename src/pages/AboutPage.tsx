import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  return (
    <div className="about-page">
      <div className="container">
        <motion.div
          className="about-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="about-header">
            <h1>About the Developer</h1>
            <div className="accent-line" />
          </div>

          <div className="about-main">
            <div className="creator-intro">
              <h2>
                Hi, I'm <span className="gold-highlight">Umair Khan</span>
              </h2>
              <p className="creator-title">
                Founding Engineer | First Class Honors | International Hackathon Winner
              </p>

              <div className="creator-description">
                <p>
                  I'm a founding engineer with a First Class Honors degree in Computer Science
                  and winner of the Minimax International Hackathon.
                </p>
                <p>
                  QuranHub was built to help people connect with the Holy Quran through
                  intelligent technology — combining AI-powered explanations, reading progress
                  tracking, and a beautiful, modern interface.
                </p>
                <p>
                  I specialize in building scalable applications with clean architecture
                  and user-centric design. My passion is creating solutions that make
                  a meaningful impact.
                </p>
              </div>
            </div>

            <div className="connect-section">
              <h3>Let's Connect</h3>
              <p>For more of my work and collaborations:</p>
              <div className="social-links-large">
                <a href="https://github.com/umairrrkhan" target="_blank" rel="noopener noreferrer" className="social-link-btn">
                  <span>View My GitHub</span>
                  <span className="link-arrow">&rarr;</span>
                </a>
                <a href="https://www.linkedin.com/in/umairkhannn/" target="_blank" rel="noopener noreferrer" className="social-link-btn">
                  <span>Connect on LinkedIn</span>
                  <span className="link-arrow">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
