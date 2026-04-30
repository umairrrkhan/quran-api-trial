import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SurahModal from '../SurahModal';
import { fetchChapters, fetchChapterVerses } from '../../services/quranApi';
import { useProgress } from '../../context/ProgressContext';
import type { Chapter, SurahContent, Verse } from '../../types/quran';
import './ChaptersSection.css';

const fallbackChapters: Chapter[] = [
  { id: 1, name_simple: 'Al-Fatihah', name_arabic: 'الفاتحة', translated_name: { language_name: 'english', name: 'The Opener' }, verses_count: 7, revelation_place: 'makkah' },
  { id: 2, name_simple: 'Al-Baqarah', name_arabic: 'البقرة', translated_name: { language_name: 'english', name: 'The Cow' }, verses_count: 286, revelation_place: 'madinah' },
  { id: 3, name_simple: "Ali 'Imran", name_arabic: 'آل عمران', translated_name: { language_name: 'english', name: 'Family of Imran' }, verses_count: 200, revelation_place: 'madinah' },
  { id: 4, name_simple: 'An-Nisa', name_arabic: 'النساء', translated_name: { language_name: 'english', name: 'The Women' }, verses_count: 176, revelation_place: 'madinah' },
  { id: 5, name_simple: "Al-Ma'idah", name_arabic: 'المائدة', translated_name: { language_name: 'english', name: 'The Table Spread' }, verses_count: 120, revelation_place: 'madinah' },
];

const ChaptersSection: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const { isSurahCompleted, markSurahCompleted } = useProgress();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchChapters();
        setChapters(data);
      } catch {
        setChapters(fallbackChapters);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSurahClick = async (chapter: Chapter) => {
    if (selectedSurah?.chapter.id === chapter.id) {
      setSelectedSurah(null);
      return;
    }
    setLoadingContent(true);
    try {
      const verses = await fetchChapterVerses(chapter.id);
      setSelectedSurah({ chapter, verses });
    } catch {
      const fallbackVerses: Verse[] = Array.from({ length: Math.min(chapter.verses_count, 7) }, (_, i) => ({
        id: i + 1,
        verse_number: i + 1,
        verse_key: `${chapter.id}:${i + 1}`,
        words: [{ id: 1, position: 1, text: '', char_type_name: 'word', translation: { text: `Verse ${i + 1} from ${chapter.translated_name.name}`, language_name: 'english' } }],
      }));
      setSelectedSurah({ chapter, verses: fallbackVerses });
    } finally {
      setLoadingContent(false);
    }
  };

  if (loading) {
    return (
      <section className="chapters-section">
        <div className="container">
          <div className="loading-state">
            <p>Loading chapters...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="chapters-section">
      <div className="container">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">Surahs of the Quran</h2>
          <p className="section-subtitle">
            Click any surah to read, explore with AI, and track your progress
          </p>
        </motion.div>

        <div className="chapters-grid">
          {chapters.map((chapter, i) => {
            const completed = isSurahCompleted(chapter.id);
            return (
              <motion.div
                key={chapter.id}
                className={`chapter-card ${completed ? 'completed' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                whileHover={{ y: -4 }}
                onClick={() => handleSurahClick(chapter)}
              >
                <div className="chapter-number-wrap">
                  <span className="chapter-number">{chapter.id}</span>
                  {completed && (
                    <motion.svg
                      className="chapter-check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--success)"
                      strokeWidth="3"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <path d="M20 6L9 17l-5-5" />
                    </motion.svg>
                  )}
                </div>
                <div className="chapter-info">
                  <h3 className="chapter-name">{chapter.name_simple}</h3>
                  <p className="chapter-arabic">{chapter.name_arabic}</p>
                  <p className="chapter-translation">
                    {chapter.translated_name.name}
                  </p>
                  <div className="chapter-meta">
                    <span>{chapter.verses_count} verses</span>
                    <span className={`revelation-tag ${chapter.revelation_place}`}>
                      {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedSurah && (
          <SurahModal
            surah={selectedSurah}
            onClose={() => setSelectedSurah(null)}
            isCompleted={isSurahCompleted(selectedSurah.chapter.id)}
            onMarkComplete={() => markSurahCompleted(selectedSurah.chapter.id)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChaptersSection;
