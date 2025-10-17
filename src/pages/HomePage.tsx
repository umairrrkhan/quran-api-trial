// src/pages/HomePage.tsx
import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import SearchSection from '../components/sections/SearchSection';
import ChaptersSection from '../components/sections/ChaptersSection';
import './HomePage.css';

const HomePage: React.FC = () => {
  const scrollToFooter = () => {
    const footer = document.querySelector('.simple-footer');
    footer?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <HeroSection />
      <SearchSection />
      <ChaptersSection />
      
      {/* Down Arrow Button */}
      <button 
        className="scroll-to-footer"
        onClick={scrollToFooter}
        aria-label="Scroll to footer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 13l5 5 5-5"/>
          <path d="M7 6l5 5 5-5"/>
        </svg>
      </button>
    </div>
  );
};

export default HomePage;