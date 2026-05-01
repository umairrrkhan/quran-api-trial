import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVerseExplanation } from '../services/deepseekApi';
import { useBookmark } from '../context/BookmarkContext';
import type { SurahContent } from '../types/quran';
import './SurahModal.css';

interface SurahModalProps {
  surah: SurahContent;
  onClose: () => void;
  isCompleted?: boolean;
  onMarkComplete?: (versesCount?: number) => void;
}

const VerseExplorer: React.FC<{
  surahName: string;
  surahId: number;
  verseNumber: number;
  translation: string;
}> = ({ surahName, surahId, verseNumber, translation }) => {
  const [explanation, setExplanation] = useState<{
    explanation: string;
    context: string;
    themes: string[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleExplain = async () => {
    if (explanation) {
      setOpen(!open);
      return;
    }
    setLoading(true);
    try {
      const result = await getVerseExplanation(
        surahName,
        surahId,
        verseNumber,
        translation
      );
      setExplanation(result);
      setOpen(true);
    } catch {
      setExplanation({
        explanation: 'Unable to fetch explanation at this time.',
        context: '',
        themes: [],
      });
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button className="verse-explain-btn" onClick={handleExplain}>
        {loading ? (
          <span className="explain-loading">Thinking...</span>
        ) : explanation && open ? (
          'Hide Explanation'
        ) : (
          'Explain with AI'
        )}
      </button>
      <AnimatePresence>
        {open && explanation && (
          <motion.div
            className="verse-explanation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {explanation.themes.length > 0 && (
              <div className="explanation-themes">
                {explanation.themes.map((theme, i) => (
                  <span key={i} className="theme-tag">
                    {theme}
                  </span>
                ))}
              </div>
            )}
            {explanation.context && (
              <div className="explanation-context">
                <strong>Context:</strong> {explanation.context}
              </div>
            )}
            <div className="explanation-text">{explanation.explanation}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SurahModal: React.FC<SurahModalProps> = ({
  surah,
  onClose,
  isCompleted,
  onMarkComplete,
}) => {
  const chapter = surah.chapter;
  const { isBookmarked, addBookmark, removeBookmark, updateNote } = useBookmark();

  return (
    <motion.div
      className="surah-modal-overlay"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="surah-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        <div className="surah-modal-header">
          <div className="surah-modal-title">
            <h2>{chapter.name_simple}</h2>
            <p className="surah-modal-arabic">{chapter.name_arabic}</p>
            <p className="surah-modal-translation">
              {chapter.translated_name.name}
            </p>
            <div className="surah-modal-meta">
              <span className="verses-count">{chapter.verses_count} verses</span>
              <span
                className={`revelation-place ${chapter.revelation_place}`}
              >
                {chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan'}
              </span>
            </div>
          </div>
          <div className="surah-modal-actions">
            {onMarkComplete && (
              <button
                className={`mark-complete-btn ${isCompleted ? 'completed' : ''}`}
                onClick={() => onMarkComplete(chapter.verses_count)}
              >
                {isCompleted ? 'Completed' : 'Mark as Read'}
              </button>
            )}
            <button className="close-modal" onClick={onClose}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="verses-container">
          {surah.verses.map((verse) => {
            const translationText = verse.words
              .filter((w) => w.char_type_name !== 'end')
              .map((w) => w.translation.text)
              .join(' ');
            const verseKey = `${chapter.id}:${verse.verse_number}`;
            const bookmarked = isBookmarked(verseKey);

            return (
              <div key={verse.id} className={`verse-item ${bookmarked ? 'bookmarked' : ''}`}>
                <div className="verse-header">
                  <span className="verse-number">
                    Verse {verse.verse_number}
                  </span>
                  <button
                    className={`verse-bookmark-btn ${bookmarked ? 'active' : ''}`}
                    onClick={() => {
                      if (bookmarked) {
                        removeBookmark(verseKey);
                      } else {
                        const arabicText = verse.words
                          .filter((w) => w.char_type_name === 'word')
                          .map((w) => w.text_uthmani || w.text)
                          .join(' ');
                        addBookmark({
                          verseKey,
                          surahId: chapter.id,
                          surahName: chapter.name_simple,
                          verseNumber: verse.verse_number,
                          arabicText,
                          translation: translationText,
                          note: '',
                          createdAt: new Date().toISOString(),
                        });
                      }
                    }}
                    title={bookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                    </svg>
                    <span>{bookmarked ? 'Saved' : 'Save'}</span>
                  </button>
                </div>
                {verse.words.filter((w) => w.char_type_name === 'word')
                  .length > 0 && (
                  <div className="verse-arabic">
                    {verse.words
                      .filter((w) => w.char_type_name === 'word')
                      .map((w) => w.text_uthmani || w.text)
                      .join(' ')}
                  </div>
                )}
                <div className="verse-translation">{translationText}</div>
                <div className="verse-actions-row">
                  <VerseExplorer
                    surahName={chapter.name_simple}
                    surahId={chapter.id}
                    verseNumber={verse.verse_number}
                    translation={translationText}
                  />
                </div>
              </div>
            );
          })}
          {surah.verses.length < chapter.verses_count && (
            <div className="partial-content-note">
              <p>
                Showing first {surah.verses.length} of {chapter.verses_count}{' '}
                verses
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SurahModal;
