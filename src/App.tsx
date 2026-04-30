import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ProgressProvider } from './context/ProgressContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgressPage from './pages/ProgressPage';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Router>
      <ProgressProvider>
        <div className="App">
          <Navigation />
          <main style={{ paddingTop: '20px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/progress" element={<ProgressPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </ProgressProvider>
    </Router>
  );
};

export default App;
