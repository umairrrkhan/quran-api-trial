import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { progress } = useProgress();
  const { user, isAuthenticated, login, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu-wrapper')) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">
        <motion.div
          className="navbar-logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link to="/">
            <span className="logo-gold">Quran</span>
            <span className="logo-dark">Hub</span>
          </Link>
        </motion.div>

        <div className="navbar-center">
          <div className="navbar-progress">
            <div className="progress-bar-track">
              <motion.div
                className="progress-bar-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
            <span className="progress-text">{progress}%</span>
          </div>
        </div>

        <div className="navbar-actions">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/progress" className={`nav-link ${isActive('/progress') ? 'active' : ''}`}>
            Progress
          </Link>
          <Link to="/bookmarks" className={`nav-link ${isActive('/bookmarks') ? 'active' : ''}`}>
            Bookmarks
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>

          <div className="nav-auth">
            {isAuthenticated && user ? (
              <div className="user-menu-wrapper">
                <button
                  className="user-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className="user-avatar">
                    {user.first_name?.[0] || user.email?.[0] || 'U'}
                  </span>
                </button>
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <strong>{user.first_name || user.email || 'User'}</strong>
                    </div>
                    <button className="user-dropdown-item" onClick={logout}>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-login" onClick={login}>
                Sign In
              </button>
            )}
          </div>

          <div className="mobile-toggle">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span
                className="hamburger-line"
                animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
              />
              <motion.span
                className="hamburger-line"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              />
              <motion.span
                className="hamburger-line"
                animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
              />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/progress" onClick={() => setIsMenuOpen(false)}>
              Progress
            </Link>
            <Link to="/bookmarks" onClick={() => setIsMenuOpen(false)}>
              Bookmarks
            </Link>
            <Link to="/about" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            {isAuthenticated ? (
              <button
                className="mobile-auth-btn"
                onClick={() => { logout(); setIsMenuOpen(false); }}
              >
                Sign Out {user?.first_name ? `(${user.first_name})` : ''}
              </button>
            ) : (
              <button
                className="mobile-auth-btn"
                onClick={() => { login(); setIsMenuOpen(false); }}
              >
                Sign In
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
