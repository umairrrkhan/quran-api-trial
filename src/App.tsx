import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import { BookmarkProvider } from './context/BookmarkContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgressPage from './pages/ProgressPage';
import BookmarksPage from './pages/BookmarksPage';
import AuthCallbackPage from './pages/AuthCallbackPage';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
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
              <Route path="/callback" element={<AuthCallbackPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        </BookmarkProvider>
      </ProgressProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
