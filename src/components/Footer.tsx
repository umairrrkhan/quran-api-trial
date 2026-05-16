import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './Footer.css';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="footer"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
    >
      <div className="footer-wave">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1440,30 L1440,60 L0,60 Z" fill="var(--bg-primary)" />
        </svg>
      </div>

      <div className="footer-inner">
        <div className="container">
          <motion.div className="footer-grid" variants={stagger}>
            <motion.div className="footer-brand" variants={fadeUp}>
              <div className="footer-logo-wrap">
                <div className="footer-glow" />
                <h3 className="footer-logo">
                  <span className="logo-gold">Quran</span>
                  <span className="logo-dark">Hub</span>
                </h3>
              </div>
              <p className="footer-brand-desc">
                Your intelligent companion for Quran reading, understanding,
                and tracking your spiritual journey.
              </p>
              <div className="footer-brand-stats">
                <motion.span
                  className="footer-brand-stat"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="footer-stat-dot" />
                  Read. Reflect. Grow.
                </motion.span>
              </div>
            </motion.div>

            <motion.div className="footer-col" variants={fadeUp}>
              <h4 className="footer-col-title">Explore</h4>
              <motion.div className="footer-col-links" variants={stagger}>
                  {[
                    { to: '/', label: 'Home' },
                    { to: '/progress', label: 'Progress' },
                    { to: '/bookmarks', label: 'Bookmarks' },
                    { to: '/about', label: 'About' },
                  ].map((link) => (
                  <motion.div key={link.to} variants={slideUp}>
                    <Link to={link.to} className="footer-link">
                      <span className="footer-link-text">{link.label}</span>
                      <span className="footer-link-arrow">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="footer-col" variants={fadeUp}>
              <h4 className="footer-col-title">Connect</h4>
              <motion.div className="footer-social" variants={stagger}>
                {[
                  {
                    href: 'https://github.com/umairrrkhan',
                    label: 'GitHub',
                    path: 'M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z',
                  },
                  {
                    href: 'https://www.linkedin.com/in/umairkhannn/',
                    label: 'LinkedIn',
                    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                  },
                ].map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                    variants={slideUp}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d={social.path} />
                    </svg>
                    <span>{social.label}</span>
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            <motion.div className="footer-col footer-col-cta" variants={fadeUp}>
              <h4 className="footer-col-title">Stay Inspired</h4>
              <p className="footer-cta-text">
                "The best of you are those who learn the Quran and teach it."
              </p>
              <motion.div
                className="footer-cta-btn-wrap"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/" className="footer-cta-btn">
                  <span>Begin Reading</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            className="footer-divider"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <motion.div
            className="footer-bottom"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <p>
              &copy; {new Date().getFullYear()} QuranHub. Built with{' '}
              <motion.span
                className="footer-heart"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                ❤
              </motion.span>{' '}
              by <span className="footer-highlight">Umair Khan</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
