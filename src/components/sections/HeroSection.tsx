import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  staggerContainer,
  fadeInUp,
} from '../../hooks/useAnimations';
import './HeroSection.css';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const words = ['Guidance', 'Wisdom', 'Peace', 'Understanding', 'Comfort'];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % words.length),
      2200
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-bg-pattern" />
      <div className="hero-glow hero-glow-1" />
      <div className="hero-glow hero-glow-2" />

      <div className="container">
        <motion.div
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="hero-badge" variants={fadeInUp}>
            <span className="badge-dot" />
            Quran Reading Companion
          </motion.div>

          <motion.h1 className="hero-title" variants={fadeInUp}>
            Begin Your{' '}
            <span className="hero-gold-text">Quran Journey</span>
            <br />
            Today
          </motion.h1>

          <motion.p className="hero-subtitle" variants={fadeInUp}>
            Discover{' '}
            <span className="rotating-word">{words[index]}</span>
          </motion.p>

          <motion.p className="hero-description" variants={fadeInUp}>
            Your personal companion for reading, understanding, and tracking the
            Holy Quran. Let every verse bring you closer.
          </motion.p>

          <motion.div className="hero-buttons" variants={fadeInUp}>
            <button
              className="btn btn-primary"
              onClick={() => {
                document
                  .querySelector('.chapters-section')
                  ?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Start Reading
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
            <button
              className="btn btn-outline"
              onClick={() => navigate('/progress')}
            >
              View Progress
            </button>
          </motion.div>

          <motion.div className="hero-stats" variants={fadeInUp}>
            <div className="stat-item">
              <span className="stat-number">114</span>
              <span className="stat-label">Surahs</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">6,236</span>
              <span className="stat-label">Verses</span>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-number">AI</span>
              <span className="stat-label">Explanations</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
