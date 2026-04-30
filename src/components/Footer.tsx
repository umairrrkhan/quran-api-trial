import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <span className="logo-gold">Quran</span>
              <span className="logo-dark">Hub</span>
            </h3>
            <p>Your intelligent companion for Quran reading, understanding, and tracking your spiritual journey.</p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/progress">Progress</Link>
            <Link to="/about">About</Link>
          </div>

          <div className="footer-links">
            <h4>Connect</h4>
            <a href="https://github.com/umairrrkhan" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/umairkhannn/" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} QuranHub. Built by{' '}
            <span className="footer-highlight">Umair Khan</span>.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
