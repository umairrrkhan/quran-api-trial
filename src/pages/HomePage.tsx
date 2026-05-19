import React from 'react';
import HeroSection from '../components/sections/HeroSection';
import ContinueReadingSection from '../components/sections/ContinueReadingSection';
import SearchSection from '../components/sections/SearchSection';
import ChaptersSection from '../components/sections/ChaptersSection';
import './HomePage.css';

const HomePage: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinue = (chapterId: number, verseNumber: number) => {
    document.querySelector('.chapters-section')?.scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => {
      const card = document.querySelector(`[data-chapter-id="${chapterId}"]`) as HTMLElement;
      card?.click();
    }, 500);
  };

  return (
    <div className="home-page">
      <HeroSection />
      <ContinueReadingSection onContinue={handleContinue} />
      <SearchSection />
      <ChaptersSection />

      <button className="scroll-top-btn" onClick={scrollToTop} aria-label="Scroll to top">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </div>
  );
};

export default HomePage;
