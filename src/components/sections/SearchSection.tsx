import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SurahModal from '../SurahModal';
import { fetchChapters, fetchChapterDetails, fetchChapterVerses } from '../../services/quranApi';
import type { SurahContent, Verse, Chapter } from '../../types/quran';
import './SearchSection.css';

const emotionSurahMap: Record<string, Array<{ id: number; name: string; name_arabic: string; translation: string; reason: string }>> = {
  sadness: [
    { id: 93, name: 'Ad-Duhaa', name_arabic: 'الضحى', translation: 'The Morning Hours', reason: 'Brings hope after hardship' },
    { id: 94, name: 'Ash-Sharh', name_arabic: 'الشرح', translation: 'The Relief', reason: 'Comfort and relief' },
    { id: 12, name: 'Yusuf', name_arabic: 'يوسف', translation: 'Joseph', reason: 'Story of patience and overcoming hardship' },
  ],
  happiness: [
    { id: 55, name: 'Ar-Rahman', name_arabic: 'الرحمن', translation: 'The Beneficent', reason: 'Celebrates Allah\'s blessings' },
    { id: 1, name: 'Al-Fatihah', name_arabic: 'الفاتحة', translation: 'The Opener', reason: 'Gratitude and praise' },
    { id: 87, name: 'Al-A\'la', name_arabic: 'الأعلى', translation: 'The Most High', reason: 'Glorifies Allah\'s greatness' },
  ],
  anxiety: [
    { id: 2, name: 'Al-Baqarah', name_arabic: 'البقرة', translation: 'The Cow', reason: 'Brings peace and security' },
    { id: 113, name: 'Al-Falaq', name_arabic: 'الفلق', translation: 'The Daybreak', reason: 'Protection from evil' },
    { id: 114, name: 'An-Nas', name_arabic: 'الناس', translation: 'Mankind', reason: 'Seeking refuge in Allah' },
  ],
  guidance: [
    { id: 1, name: 'Al-Fatihah', name_arabic: 'الفاتحة', translation: 'The Opener', reason: 'The path of guidance' },
    { id: 36, name: 'Ya-Sin', name_arabic: 'يس', translation: 'Ya Sin', reason: 'Heart of the Quran' },
    { id: 67, name: 'Al-Mulk', name_arabic: 'الملك', translation: 'The Sovereignty', reason: 'Purpose and meaning' },
  ],
  patience: [
    { id: 2, name: 'Al-Baqarah', name_arabic: 'البقرة', translation: 'The Cow', reason: 'Teaches patience and perseverance' },
    { id: 3, name: 'Ali \'Imran', name_arabic: 'آل عمران', translation: 'Family of Imran', reason: 'Steadfastness in faith' },
    { id: 103, name: 'Al-\'Asr', name_arabic: 'العصر', translation: 'The Declining Day', reason: 'Value of patience and time' },
  ],
  forgiveness: [
    { id: 3, name: 'Ali \'Imran', name_arabic: 'آل عمران', translation: 'Family of Imran', reason: 'Allah\'s mercy and forgiveness' },
    { id: 39, name: 'Az-Zumar', name_arabic: 'الزمر', translation: 'The Troops', reason: 'Seeking forgiveness' },
    { id: 110, name: 'An-Nasr', name_arabic: 'النصر', translation: 'The Divine Support', reason: 'Forgiveness and victory' },
  ],
  strength: [
    { id: 67, name: 'Al-Mulk', name_arabic: 'الملك', translation: 'The Sovereignty', reason: 'Strength through faith' },
    { id: 48, name: 'Al-Fath', name_arabic: 'الفتح', translation: 'The Victory', reason: 'Divine strength and support' },
    { id: 57, name: 'Al-Hadid', name_arabic: 'الحديد', translation: 'The Iron', reason: 'Strength and resilience' },
  ],
  gratitude: [
    { id: 55, name: 'Ar-Rahman', name_arabic: 'الرحمن', translation: 'The Beneficent', reason: 'Counting blessings' },
    { id: 16, name: 'An-Nahl', name_arabic: 'النحل', translation: 'The Bee', reason: 'Gratitude for creation' },
    { id: 14, name: 'Ibrahim', name_arabic: 'ابراهيم', translation: 'Abraham', reason: 'Thankfulness and blessings' },
  ],
  fear: [
    { id: 113, name: 'Al-Falaq', name_arabic: 'الفلق', translation: 'The Daybreak', reason: 'Protection from fear' },
    { id: 114, name: 'An-Nas', name_arabic: 'الناس', translation: 'Mankind', reason: 'Refuge from fear' },
    { id: 23, name: 'Al-Mu\'minun', name_arabic: 'المؤمنون', translation: 'The Believers', reason: 'Overcoming fear through faith' },
  ],
  hope: [
    { id: 93, name: 'Ad-Duhaa', name_arabic: 'الضحى', translation: 'The Morning Hours', reason: 'Hope after darkness' },
    { id: 94, name: 'Ash-Sharh', name_arabic: 'الشرح', translation: 'The Relief', reason: 'Relief and hope' },
    { id: 92, name: 'At-Tin', name_arabic: 'التين', translation: 'The Fig', reason: 'Human dignity and hope' },
  ],
};

const aiResponses = {
  greeting: [
    'I understand what you\'re feeling. Here are some beautiful Surahs that may resonate with your heart.',
    'Based on your emotions, I\'ve found these Surahs that offer comfort and guidance.',
    'Let these verses from the Quran bring light to your current state of mind.',
  ],
};

function detectEmotion(text: string): string {
  const lower = text.toLowerCase();
  if (/sad|depressed|unhappy|cry|lonely/.test(lower)) return 'sadness';
  if (/happy|joy|celebrate|blessed|grateful/.test(lower)) return 'happiness';
  if (/anxious|worry|stress|panic|overwhelm/.test(lower)) return 'anxiety';
  if (/guid|help|direction|path|confus/.test(lower)) return 'guidance';
  if (/patient|wait|persever|endur|tire/.test(lower)) return 'patience';
  if (/forgiv|mistake|sorry|sin|regret/.test(lower)) return 'forgiveness';
  if (/strong|courage|power|weak|brave/.test(lower)) return 'strength';
  if (/thank|grateful|blessing|appreciate/.test(lower)) return 'gratitude';
  if (/fear|scared|afraid|terror|panic/.test(lower)) return 'fear';
  if (/hope|future|optimistic|better|dream/.test(lower)) return 'hope';
  return 'guidance';
}

type SearchMode = 'emotion' | 'surah';

const SearchSection: React.FC = () => {
  const [mode, setMode] = useState<SearchMode>('emotion');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [recommendations, setRecommendations] = useState<typeof emotionSurahMap['sadness']>([]);
  const [surahResults, setSurahResults] = useState<Chapter[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [aiMessage, setAiMessage] = useState('');
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    fetchChapters().then(setChapters).catch(() => {});
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setIsSearching(true);
    setHasSearched(true);

    if (mode === 'emotion') {
      setTimeout(() => {
        const emotion = detectEmotion(query);
        const surahs = emotionSurahMap[emotion] || emotionSurahMap.guidance;
        const greeting = aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
        setAiMessage(greeting);
        setRecommendations(surahs);
        setIsSearching(false);
      }, 1200);
    } else {
      setTimeout(() => {
        const q = query.toLowerCase().trim();
        const results = chapters.filter((c) =>
          c.name_simple.toLowerCase().includes(q) ||
          c.name_arabic.includes(query) ||
          c.translated_name.name.toLowerCase().includes(q) ||
          String(c.id).includes(q)
        );
        setSurahResults(results);
        setIsSearching(false);
      }, 300);
    }
  };

  const handleSurahClick = async (surah: { id: number; name: string; name_arabic: string; translation: string }) => {
    if (selectedSurah?.chapter.id === surah.id) {
      setSelectedSurah(null);
      return;
    }
    setLoadingContent(true);
    try {
      const chapter = await fetchChapterDetails(surah.id);
      const verses = await fetchChapterVerses(surah.id);
      setSelectedSurah({ chapter, verses });
    } catch {
      setSelectedSurah({
        chapter: { id: surah.id, name_simple: surah.name, name_arabic: surah.name_arabic, translated_name: { language_name: 'english', name: surah.translation }, verses_count: 7, revelation_place: 'makkah' } as Chapter,
        verses: Array.from({ length: 7 }, (_, i) => ({ id: i + 1, verse_number: i + 1, verse_key: `${surah.id}:${i + 1}`, words: [{ id: 1, position: 1, text: '', char_type_name: 'word', translation: { text: 'Loading verse...', language_name: 'english' } }] } as Verse)),
      });
    } finally {
      setLoadingContent(false);
    }
  };

  const handleChapterClick = async (chapter: Chapter) => {
    if (selectedSurah?.chapter.id === chapter.id) {
      setSelectedSurah(null);
      return;
    }
    setLoadingContent(true);
    try {
      const verses = await fetchChapterVerses(chapter.id);
      setSelectedSurah({ chapter, verses });
    } catch {
      setSelectedSurah(null);
    } finally {
      setLoadingContent(false);
    }
  };

  const placeholders = {
    emotion: "e.g. I'm feeling anxious, I need guidance, I want peace...",
    surah: "e.g. Al-Baqarah, Yusuf, Ar-Rahman, Fatihah...",
  };

  return (
    <section className="search-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Explore the Quran</h2>
          <p className="section-subtitle">
            Search for any surah by name, or describe how you feel for AI-powered recommendations
          </p>
        </motion.div>

        <motion.div
          className="search-tabs"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <button
            className={`search-tab ${mode === 'emotion' ? 'active' : ''}`}
            onClick={() => { setMode('emotion'); setHasSearched(false); setQuery(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            AI Guidance
          </button>
          <button
            className={`search-tab ${mode === 'surah' ? 'active' : ''}`}
            onClick={() => { setMode('surah'); setHasSearched(false); setQuery(''); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
            </svg>
            Find Surah
          </button>
        </motion.div>

        <motion.div
          className="search-box-container"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <input
            type="text"
            placeholder={placeholders[mode]}
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            disabled={isSearching}
          />
          <button
            className="search-btn"
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
          >
            {isSearching ? (mode === 'emotion' ? 'Reflecting...' : 'Searching...') : mode === 'emotion' ? 'Ask AI' : 'Find'}
          </button>
        </motion.div>

        <AnimatePresence mode="wait">
          {isSearching && (
            <motion.div
              className="ai-thinking"
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="thinking-bar">
                <motion.div
                  className="thinking-bar-fill"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p>{mode === 'emotion' ? 'Analyzing your emotions...' : 'Searching surahs...'}</p>
            </motion.div>
          )}

          {hasSearched && !isSearching && mode === 'emotion' && (
            <motion.div
              className="ai-results"
              key="emotion-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="ai-message-bubble"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="ai-avatar">AI</div>
                <p>{aiMessage}</p>
              </motion.div>

              <div className="recommendations-grid">
                {recommendations.map((surah, i) => (
                  <motion.div
                    key={surah.id}
                    className="rec-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    whileHover={{ y: -4 }}
                    onClick={() => handleSurahClick(surah)}
                  >
                    <div className="rec-card-header">
                      <h4>{surah.name}</h4>
                      <span className="rec-number">#{surah.id}</span>
                    </div>
                    <p className="rec-arabic">{surah.name_arabic}</p>
                    <p className="rec-translation">{surah.translation}</p>
                    <div className="rec-reason">
                      <span className="reason-label">Why:</span> {surah.reason}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {hasSearched && !isSearching && mode === 'surah' && (
            <motion.div
              className="keyword-results"
              key="surah-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="keyword-count">{surahResults.length} surah{surahResults.length !== 1 ? 's' : ''} found for "{query}"</p>
              {surahResults.length === 0 ? (
                <div className="keyword-empty">
                  <p>No surahs found. Try a different name like "Baqarah", "Yusuf", or "Rahman".</p>
                </div>
              ) : (
                <div className="recommendations-grid">
                  {surahResults.map((chapter, i) => (
                    <motion.div
                      key={chapter.id}
                      className="rec-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      whileHover={{ y: -4 }}
                      onClick={() => handleChapterClick(chapter)}
                    >
                      <div className="rec-card-header">
                        <h4>{chapter.name_simple}</h4>
                        <span className="rec-number">#{chapter.id}</span>
                      </div>
                      <p className="rec-arabic">{chapter.name_arabic}</p>
                      <p className="rec-translation">{chapter.translated_name.name}</p>
                      <div className="rec-reason">
                        <span className="reason-label">{chapter.verses_count} verses</span> &middot; {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {loadingContent && (
        <div className="search-loading-overlay">
          <div className="search-loading-spinner" />
        </div>
      )}

      <AnimatePresence>
        {selectedSurah && (
          <SurahModal
            surah={selectedSurah}
            onClose={() => setSelectedSurah(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SearchSection;
