// src/components/sections/HeroSection.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeInUp, smoothFloat } from '../../hooks/useAnimations';
import './HeroSection.css';

interface HeroSectionProps {
  children?: React.ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = () => {
  const rotatingWords = ['Guidance', 'Wisdom', 'Peace', 'Understanding', 'Comfort'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 2000); // Change word every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        {/* Enhanced decorative background elements */}
        <div className="hero-background-elements">
          <motion.div 
            className="hero-shape hero-shape-1"
            variants={smoothFloat}
            initial="hidden"
            animate="visible"
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          ></motion.div>
          <motion.div 
            className="hero-shape hero-shape-2"
            variants={smoothFloat}
            initial="hidden"
            animate="visible"
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          ></motion.div>
          <motion.div 
            className="hero-shape hero-shape-3"
            variants={smoothFloat}
            initial="hidden"
            animate="visible"
            transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", delay: 2 }}
          ></motion.div>
        </div>
        
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="hero-title"
            variants={fadeInUp}
          >
            Not sure what to read in Quran?
          </motion.h1>
          
          <motion.p 
            className="hero-subtitle"
            variants={fadeInUp}
            transition={{ delay: 0.2 }}
          >
            Discover meaningful <span className="rotating-word red-accent">{rotatingWords[currentWordIndex]}</span>
          </motion.p>
          
          <motion.div
            className="hero-description"
            variants={fadeInUp}
            transition={{ delay: 0.4 }}
          >
            <p>
              Our platform helps those who are new to the Quran or unsure where to start. 
              Explore carefully selected verses, thematic collections, and guided readings.
            </p>
          </motion.div>
          
          <motion.div
            className="hero-buttons"
            variants={fadeInUp}
            transition={{ delay: 0.6 }}
          >
            <button 
              className="btn btn-primary"
              onClick={() => {
                const chaptersSection = document.querySelector('.chapters-section');
                chaptersSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Discover Verses
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;