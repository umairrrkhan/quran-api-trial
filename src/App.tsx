import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import ProfilePage from './pages/ProfilePage';
import './styles/globals.css';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
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
              <Route path="/profile" element={<ProfilePage />} />
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
