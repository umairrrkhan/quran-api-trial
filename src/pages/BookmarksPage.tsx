import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBookmark } from '../context/BookmarkContext';
import { getVerseExplanation } from '../services/deepseekApi';
import './BookmarksPage.css';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BookmarksPage: React.FC = () => {
  const { bookmarks, loading, error, removeBookmark, updateNote, bookmarksCount } = useBookmark();
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedSurahs, setExpandedSurahs] = useState<Set<string>>(new Set());
  const [bmExplanation, setBmExplanation] = useState<Record<string, { explanation: string; context: string; themes: string[] } | null>>({});
  const [bmExplaining, setBmExplaining] = useState<Record<string, boolean>>({});

  const handleBmExplain = async (verseKey: string, surahName: string, surahId: number, verseNumber: number, translation: string) => {
    if (bmExplanation[verseKey]) {
      setBmExplanation((prev) => ({ ...prev, [verseKey]: null }));
      return;
    }
    setBmExplaining((prev) => ({ ...prev, [verseKey]: true }));
    try {
      const result = await getVerseExplanation(surahName, surahId, verseNumber, translation);
      setBmExplanation((prev) => ({ ...prev, [verseKey]: result }));
    } catch {
      setBmExplanation((prev) => ({ ...prev, [verseKey]: { explanation: 'Unable to fetch explanation.', context: '', themes: [] } }));
    }
    setBmExplaining((prev) => ({ ...prev, [verseKey]: false }));
  };

  const toggleSurah = (name: string) => {
    setExpandedSurahs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () => setExpandedSurahs(new Set(groupedBookmarks.map((g) => g.name)));
  const collapseAll = () => setExpandedSurahs(new Set());

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery.trim()) return bookmarks;
    const q = searchQuery.toLowerCase();
    return bookmarks.filter(
      (b) =>
        b.surahName.toLowerCase().includes(q) ||
        b.translation.toLowerCase().includes(q) ||
        b.arabicText.includes(searchQuery) ||
        b.verseKey.includes(q)
    );
  }, [bookmarks, searchQuery]);

  const groupedBookmarks = useMemo(() => {
    const map = new Map<string, typeof bookmarks>();
    filteredBookmarks.forEach((bm) => {
      const existing = map.get(bm.surahName) || [];
      existing.push(bm);
      map.set(bm.surahName, existing);
    });
    return Array.from(map.entries()).map(([name, verses]) => ({
      name,
      verses,
      surahId: verses[0].surahId,
    }));
  }, [filteredBookmarks]);

  return (
    <div className="bookmarks-page">
      <section className="bm-hero">
        <div className="container">
          <motion.div
            className="bm-hero-content"
            initial="hidden"
            animate="show"
          >
            <motion.div className="bm-badge" variants={fadeUp}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
              {bookmarksCount} Saved Verse{bookmarksCount !== 1 ? 's' : ''}
            </motion.div>
            <motion.h1 className="bm-title" variants={fadeUp}>
              Your <span className="bm-gold">Bookmarks</span>
            </motion.h1>
            <motion.p className="bm-sub" variants={fadeUp}>
              Save meaningful verses with personal reflections and AI-powered explanations.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="bm-content">
        <div className="container">
          {loading ? (
            <div className="bm-loading">Loading bookmarks...</div>
          ) : error ? (
            <div className="bm-error">
              <h3>Could not load bookmarks</h3>
              <p>{error}</p>
              <Link to="/" className="bm-empty-btn">Browse Surahs</Link>
            </div>
          ) : bookmarksCount === 0 ? (
            <motion.div className="bm-empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="bm-empty-icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
                </svg>
              </div>
              <h3>No bookmarks yet</h3>
              <p>When you read a surah, tap the <strong>Save</strong> button on any verse to bookmark it here.</p>
              <Link to="/" className="bm-empty-btn">Browse Surahs</Link>
            </motion.div>
          ) : (
            <>
              <motion.div className="bm-search" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <svg className="bm-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  className="bm-search-input"
                  type="text"
                  placeholder="Search by surah name, verse, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="bm-search-clear" onClick={() => setSearchQuery('')}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </motion.div>

              <div className="bm-controls">
                <span className="bm-controls-count">{filteredBookmarks.length} bookmark{filteredBookmarks.length !== 1 ? 's' : ''} in {groupedBookmarks.length} surah{groupedBookmarks.length !== 1 ? 's' : ''}</span>
                <div className="bm-controls-actions">
                  <button className="bm-control-btn" onClick={expandAll}>Expand all</button>
                  <button className="bm-control-btn" onClick={collapseAll}>Collapse all</button>
                </div>
              </div>

              <motion.div className="bm-groups" initial="hidden" animate="show">
                {groupedBookmarks.length === 0 ? (
                  <div className="bm-empty">
                    <h3>No matching bookmarks</h3>
                    <p>Try a different search term.</p>
                  </div>
                ) : (
                  groupedBookmarks.map((group) => {
                    const isOpen = expandedSurahs.has(group.name);
                    return (
                      <motion.div key={group.name} className="bm-group" variants={fadeUp}>
                        <button className="bm-group-header" onClick={() => toggleSurah(group.name)}>
                          <div className="bm-group-info">
                            <span className="bm-group-name">{group.name}</span>
                            <span className="bm-group-count">{group.verses.length} verse{group.verses.length !== 1 ? 's' : ''}</span>
                          </div>
                          <motion.svg
                            className="bm-group-arrow"
                            width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <path d="M6 9l6 6 6-6" />
                          </motion.svg>
                        </button>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="bm-group-body"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              {group.verses.map((bm) => {
                                const exp = bmExplanation[bm.verseKey];
                                const explaining = bmExplaining[bm.verseKey];
                                return (
                                  <div key={bm.verseKey} className="bm-verse">
                                    <div className="bm-verse-head">
                                      <span className="bm-verse-num">Verse {bm.verseNumber}</span>
                                      <button className="bm-remove-btn" onClick={() => removeBookmark(bm.verseKey)} title="Remove">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                          <path d="M18 6L6 18M6 6l12 12" />
                                        </svg>
                                      </button>
                                    </div>
                                    <p className="bm-verse-arabic">{bm.arabicText}</p>
                                    <p className="bm-verse-translation">{bm.translation}</p>

                                    <div className="bm-verse-actions">
                                      <button
                                        className="bm-explain-btn"
                                        onClick={() => handleBmExplain(bm.verseKey, bm.surahName, bm.surahId, bm.verseNumber, bm.translation)}
                                      >
                                        {explaining ? (
                                          <><span className="bm-explain-spinner" /> Thinking...</>
                                        ) : exp ? (
                                          'Hide Explanation'
                                        ) : (
                                          'Explain with AI'
                                        )}
                                      </button>
                                    </div>

                                    <AnimatePresence>
                                      {exp && (
                                        <motion.div
                                          className="bm-explanation"
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          {exp.themes.length > 0 && (
                                            <div className="bm-themes">
                                              {exp.themes.map((t, i) => <span key={i} className="bm-theme-tag">{t}</span>)}
                                            </div>
                                          )}
                                          {exp.context && <div className="bm-context"><strong>Context:</strong> {exp.context}</div>}
                                          <div className="bm-explain-text">{exp.explanation}</div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>

                                    {editingNote === bm.verseKey ? (
                                      <div className="bm-note-edit">
                                        <textarea className="bm-note-input" value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Write your reflection..." rows={2} />
                                        <div className="bm-note-actions">
                                          <button className="bm-note-save" onClick={() => { updateNote(bm.verseKey, noteText); setEditingNote(null); }}>Save</button>
                                          <button className="bm-note-cancel" onClick={() => setEditingNote(null)}>Cancel</button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="bm-note-display" onClick={() => { setEditingNote(bm.verseKey); setNoteText(bm.note); }}>
                                        {bm.note ? (
                                          <><span className="bm-note-icon"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" /></svg></span><p className="bm-note-text">{bm.note}</p></>
                                        ) : (
                                          <span className="bm-note-add">+ Add reflection</span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })
                )}
              </motion.div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default BookmarksPage;
