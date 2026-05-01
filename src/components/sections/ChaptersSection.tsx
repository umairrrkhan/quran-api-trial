import React, { useState, useEffect, useMemo } from 'react';
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

type FilterType = 'all' | 'completed' | 'not-completed';

const motivationalQuotes = [
  '"The best among you are those who learn the Quran and teach it." — Prophet Muhammad (PBUH)',
  '"Read the Quran, for it will come as an intercessor for its reciters on the Day of Resurrection." — Prophet Muhammad (PBUH)',
  '"Whoever recites a letter from the Book of Allah will be credited with a good deed, and a good deed gets ten-fold reward." — Prophet Muhammad (PBUH)',
  '"The most beloved deed to Allah is the most regular and consistent even if it were little." — Prophet Muhammad (PBUH)',
  '"Take benefit of five before five: your youth before your old age, your health before your sickness…" — Prophet Muhammad (PBUH)',
  '"The one who recites the Quran and acts upon it, his parents will be crowned on the Day of Resurrection with a light brighter than the sun." — Prophet Muhammad (PBUH)',
  '"Your Lord says: If you come to Me walking, I will come to you running." — Hadith Qudsi',
  '"Allah does not burden a soul more than it can bear." — Quran 2:286',
  '"So verily, with every difficulty there is ease." — Quran 94:5',
  '"And whoever puts their trust in Allah, He is sufficient for them." — Quran 65:3',
];

const versesOfTheDay = [
  { verse: 'Indeed, this Quran guides to that which is most just.', ref: 'Quran 17:9' },
  { verse: 'And We have certainly made the Quran easy to remember, so is there anyone who will be mindful?', ref: 'Quran 54:17' },
  { verse: 'Your Lord has not taken leave of you, nor has He detested you.', ref: 'Quran 93:3' },
  { verse: 'And whoever fears Allah — He will make for him a way out. And will provide for him from where he does not expect.', ref: 'Quran 65:2-3' },
  { verse: 'And when My servants ask you concerning Me — indeed I am near.', ref: 'Quran 2:186' },
  { verse: 'Indeed, with hardship comes ease.', ref: 'Quran 94:6' },
  { verse: 'Say, O My servants who have transgressed against themselves, do not despair of the mercy of Allah.', ref: 'Quran 39:53' },
  { verse: 'And He found you lost and guided you.', ref: 'Quran 93:7' },
  { verse: 'So remember Me; I will remember you.', ref: 'Quran 2:152' },
  { verse: 'And whoever puts their trust in Allah — He is sufficient for them.', ref: 'Quran 65:3' },
  { verse: 'And your Lord creates what He wills and chooses.', ref: 'Quran 28:68' },
  { verse: 'And the Hereafter is better for you than the first life.', ref: 'Quran 93:4' },
  { verse: 'Call upon Me; I will respond to you.', ref: 'Quran 40:60' },
];

const ChaptersSection: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSurah, setSelectedSurah] = useState<SurahContent | null>(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const { isSurahCompleted, markSurahCompleted } = useProgress();
  const [dailyQuote] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayIndex = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    return motivationalQuotes[dayIndex % motivationalQuotes.length];
  });

  const [dailyVerse] = useState(() => {
    const today = new Date().toISOString().split('T')[0];
    const dayIndex = today.split('-').reduce((a, b) => a + parseInt(b), 0);
    return versesOfTheDay[dayIndex % versesOfTheDay.length];
  });

  const filteredChapters = useMemo(() => {
    switch (filter) {
      case 'completed':
        return chapters.filter((c) => isSurahCompleted(c.id));
      case 'not-completed':
        return chapters.filter((c) => !isSurahCompleted(c.id));
      default:
        return chapters;
    }
  }, [chapters, filter, isSurahCompleted]);

  const counts = useMemo(() => {
    const completed = chapters.filter((c) => isSurahCompleted(c.id)).length;
    return { completed, total: chapters.length };
  }, [chapters, isSurahCompleted]);

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

        <motion.div
          className="daily-motivation"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="motivation-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <p className="motivation-text">{dailyQuote}</p>
        </motion.div>

        <motion.div
          className="verse-of-day"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="vod-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <div className="vod-body">
            <p className="vod-label">Verse of the Day</p>
            <p className="vod-text">"{dailyVerse.verse}"</p>
            <p className="vod-ref">— {dailyVerse.ref}</p>
          </div>
        </motion.div>

        <div className="chapters-filter">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({counts.total})
          </button>
          <button
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({counts.completed})
          </button>
          <button
            className={`filter-btn ${filter === 'not-completed' ? 'active' : ''}`}
            onClick={() => setFilter('not-completed')}
          >
            Not Completed ({counts.total - counts.completed})
          </button>
        </div>

        <div className="chapters-grid">
          {filteredChapters.length === 0 && (
            <div className="filter-empty">
              <p>{filter === 'completed' ? 'No completed surahs yet. Start reading!' : filter === 'not-completed' ? 'All surahs completed! Masha\'Allah!' : ''}</p>
            </div>
          )}
          {filteredChapters.map((chapter, i) => {
            const completed = isSurahCompleted(chapter.id);
            return (
              <motion.div
                key={chapter.id}
                className={`chapter-card ${completed ? 'completed' : ''}`}
                layout
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
            onMarkComplete={(v) => markSurahCompleted(selectedSurah.chapter.id, v)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ChaptersSection;
