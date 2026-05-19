import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { getReadingSessions } from '../../services/qfUserApi';
import { fetchChapters } from '../../services/quranApi';
import type { QfSimpleReadingSession } from '../../services/qfUserApi';
import type { Chapter } from '../../types/quran';
import './ContinueReadingSection.css';

interface ContinueReadingSectionProps {
  onContinue: (chapterId: number, verseNumber: number) => void;
}

const ContinueReadingSection: React.FC<ContinueReadingSectionProps> = ({ onContinue }) => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [session, setSession] = useState<QfSimpleReadingSession | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    const load = async () => {
      setLoading(true);
      setError('');
      const token = await getAccessToken();
      if (!token) { setLoading(false); return; }
      const res = await getReadingSessions(token, 1);
      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }
      const raw: any = res.data;
      const list: any[] = Array.isArray(raw) ? raw : (raw?.data || []);
      if (list.length === 0) {
        setLoading(false);
        return;
      }
      const latest = list[0] as QfSimpleReadingSession;
      setSession(latest);

      try {
        const chapters = await fetchChapters();
        const ch = chapters.find((c: Chapter) => c.id === latest.chapterNumber) || null;
        setChapter(ch);
      } catch {}
      setLoading(false);
    };
    load();
  }, [isAuthenticated, getAccessToken]);

  if (loading) {
    return (
      <section className="continue-section">
        <div className="container">
          <div className="continue-loading">Loading reading session...</div>
        </div>
      </section>
    );
  }

  if (error || !session || !chapter) return null;

  return (
    <section className="continue-section">
      <div className="container">
        <motion.div
          className="continue-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="continue-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10,8 16,12 10,16" />
            </svg>
          </div>
          <div className="continue-info">
            <span className="continue-label">Continue Reading</span>
            <span className="continue-detail">
              {chapter.name_simple} &middot; Verse {session.verseNumber}
            </span>
          </div>
          <button
            className="continue-btn"
            onClick={() => onContinue(session.chapterNumber, session.verseNumber)}
          >
            Resume
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ContinueReadingSection;
