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
            <h1>About This Project</h1>
            <div className="accent-line" />
          </div>

          <div className="about-main">
            <div className="creator-intro">
              <h2>
                Quran Journey Tracker
              </h2>
              <p className="creator-title">
                Built for the Quran Foundation Hackathon
              </p>

              <div className="creator-description">
                <p>
                  This project started as a hackathon submission for the Quran Foundation
                  Hackathon and has since been extended far beyond its original scope.
                  What began as a simple reading tracker evolved into a full-featured Quran
                  companion with AI-powered explanations, progress tracking, and a beautiful
                  modern interface.
                </p>

                <h3>Tech Stack</h3>
                <ul className="tech-list">
                  <li><strong>Quran Foundation API</strong> — All Quranic content including chapters, verses, and translations</li>
                  <li><strong>DeepSeek API</strong> — AI-powered verse explanations and context</li>
                  <li><strong>React 18 + TypeScript</strong> — Frontend framework with full type safety</li>
                  <li><strong>Framer Motion</strong> — Smooth animations and page transitions</li>
                  <li><strong>jsPDF</strong> — PDF export with native programmatic rendering</li>
                  <li><strong>React Router</strong> — Client-side routing between pages</li>
                </ul>

                <h3>Key Features</h3>
                <ul className="tech-list">
                  <li>Browse all 114 surahs with Arabic text and English translations</li>
                  <li>AI-powered verse explanations with context and themes</li>
                  <li>Reading progress tracking with visual completion map</li>
                  <li>Filter surahs by completed / not completed status</li>
                  <li>Export progress as CSV, TXT, or beautifully styled PDF</li>
                  <li>Daily motivational verses to encourage consistent reading</li>
                  <li>Emotion-based surah recommendations</li>
                  <li>Animated lantern visualization of reading journey</li>
                </ul>
              </div>
            </div>

            <div className="connect-section">
              <h3>Open Source</h3>
              <p>This project is open source. View the code, report issues, or contribute:</p>
              <div className="social-links-large">
                <a href="https://github.com/umairrrkhan/quran-api-trial" target="_blank" rel="noopener noreferrer" className="social-link-btn">
                  <span>View on GitHub</span>
                  <span className="link-arrow">&rarr;</span>
                </a>
                <Link to="/" className="social-link-btn">
                  <span>Explore the Quran</span>
                  <span className="link-arrow">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutPage;
