import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { BookmarkProvider } from './context/BookmarkContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgressPage from './pages/ProgressPage';
import BookmarksPage from './pages/BookmarksPage';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <ProgressProvider>
        <BookmarkProvider>
        <div className="App">
          <Navigation />
          <main style={{ paddingTop: '20px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/progress" element={<ProgressPage />} />
              <Route path="/bookmarks" element={<BookmarksPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </BookmarkProvider>
      </ProgressProvider>
    </Router>
  );
};

export default App;
