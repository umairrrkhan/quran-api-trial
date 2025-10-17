// src/components/Navigation.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../styles/globals.css';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`cylinder-navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container flex justify-between items-center py-4">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl font-bold">
            <span className="text-red-600">Quran</span>
            <span className="text-gray-800">Hub</span>
          </h1>
        </motion.div>
        
        <div className="flex items-center space-x-4">
          {/* Home Link */}
          <Link 
            to="/" 
            className="nav-home-link"
          >
            Home
          </Link>
          
          {/* Cylindrical Ask Button */}
          <motion.button
            className="cylinder-ask-button"
            whileHover={{ 
              scale: 1.05,
              backgroundColor: 'var(--primary-red)',
              color: 'white'
            }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const searchSection = document.querySelector('.search-section');
              searchSection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Ask
          </motion.button>
          
          {/* Mobile Menu Button - only show on mobile */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="focus:outline-none z-50"
              aria-label="Toggle menu"
            >
              <div className="space-y-1.5">
                <motion.span 
                  className={`block w-6 h-0.5 bg-red-600 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                  animate={isMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
                <motion.span 
                  className={`block w-6 h-0.5 bg-red-600 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}
                  animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
                <motion.span 
                  className={`block w-6 h-0.5 bg-red-600 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                  animate={isMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                ></motion.span>
              </div>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation Menu - only available on mobile */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-menu md:hidden absolute top-0 left-0 w-full h-screen bg-white z-40 pt-16"
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ type: "spring", damping: 25 }}
          >
            <div className="container">
              <ul className="flex flex-col space-y-4 py-4">
                {['Home', 'Surahs', 'Juz', 'About', 'Resources'].map((item) => (
                  <li>
                    <a 
                      href="#" 
                      className="text-lg text-gray-700 hover:text-red-600 transition-colors duration-300 font-medium py-2 block"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;