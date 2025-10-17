// src/components/Footer.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

const Footer: React.FC = () => {
  return (
    <footer className="simple-footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>QuranHub</h3>
            <p>Smart Quran guidance for modern life</p>
          </div>
          
          <div className="footer-section">
            <h4>Developer</h4>
            <p>Built by <span className="red-highlight">Umair Khan</span></p>
            <p className="dev-creds">Founding Engineer | First Class Honors | Minimax Hackathon Winner</p>
            <div className="social-links">
              <a href="https://github.com/umairrrkhan" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.linkedin.com/in/umairkhannn/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>
            © {new Date().getFullYear()} QuranHub. Assessment project for Quran Team.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;