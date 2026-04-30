import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import './ProgressPage.css';

const surahs = Array.from({ length: 114 }, (_, i) => i + 1);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.03 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProgressPage: React.FC = () => {
  const { progress, completedCount, isSurahCompleted, resetProgress } = useProgress();
  const remaining = 114 - completedCount;
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const completedSurahs = useMemo(
    () => surahs.filter((id) => isSurahCompleted(id)),
    [isSurahCompleted]
  );

  return (
    <div className="progress-page">
      <section className="pp-hero">
        <div className="pp-hero-bg">
          <div className="pp-circle c1" />
          <div className="pp-circle c2" />
          <div className="pp-circle c3" />
          <div className="pp-grid-pattern" />
        </div>
        <div className="container">
          <motion.div
            className="pp-hero-content"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div className="pp-badge" variants={item}>
              <span className="pp-badge-dot" />
              Your Spiritual Dashboard
            </motion.div>
            <motion.h1 className="pp-title" variants={item}>
              Your <span className="pp-gold">Quran Journey</span>
            </motion.h1>
            <motion.p className="pp-sub" variants={item}>
              Every surah you complete brings you closer. Track your progress
              and celebrate each milestone.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="pp-stats-section">
        <div className="container">
          <motion.div
            className="pp-stats-grid"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
          >
            <motion.div className="pp-stat" variants={item}>
              <div className="pp-stat-icon pp-stat-complete">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <path d="M22 4L12 14.01l-3-3" />
                </svg>
              </div>
              <div className="pp-stat-body">
                <span className="pp-stat-num">{completedCount}</span>
                <span className="pp-stat-label">Surahs Completed</span>
                <div className="pp-stat-bar">
                  <motion.div
                    className="pp-stat-fill pp-fill-green"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(completedCount / 114) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="pp-stat" variants={item}>
              <div className="pp-stat-icon pp-stat-progress">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12A10 10 0 1112 2v4a6 6 0 100 12 6 6 0 006-6h4z" />
                </svg>
              </div>
              <div className="pp-stat-body">
                <span className="pp-stat-num">{progress}%</span>
                <span className="pp-stat-label">Complete</span>
                <div className="pp-stat-bar">
                  <motion.div
                    className="pp-stat-fill pp-fill-gold"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div className="pp-stat" variants={item}>
              <div className="pp-stat-icon pp-stat-remaining">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="pp-stat-body">
                <span className="pp-stat-num">{remaining}</span>
                <span className="pp-stat-label">Remaining</span>
                <div className="pp-stat-bar">
                  <motion.div
                    className="pp-stat-fill pp-fill-gray"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(remaining / 114) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: 0.4, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="pp-graph-section">
        <div className="container">
          <div className="pp-divider">
            <span className="pp-divider-icon">✦</span>
          </div>

          <motion.div
            className="pp-graph-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="pp-graph-header">
              <div>
                <h3 className="pp-graph-title">Completion Map</h3>
                <p className="pp-graph-desc">
                  {completedCount} of 114 surahs completed
                </p>
              </div>
              <button
                className="pp-reset-btn"
                onClick={() => setShowResetConfirm(true)}
                title="Reset all progress"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 4v6h6M23 20v-6h-6" />
                  <path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15" />
                </svg>
              </button>
            </div>

            <div className="pp-graph-body">
              <div className="pp-graph-grid">
                {surahs.map((id) => {
                  const done = completedSurahs.includes(id);
                  return (
                    <motion.div
                      key={id}
                      className={`pp-graph-cell ${done ? 'done' : ''}`}
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: id * 0.005, duration: 0.3 }}
                      title={`Surah ${id}${done ? ' ✓' : ''}`}
                    />
                  );
                })}
              </div>
            </div>

            <div className="pp-graph-footer">
              <span className="pp-graph-label">Not started</span>
              <div className="pp-graph-legend">
                <div className="graph-legend-cell empty" />
                <div className="graph-legend-cell done" />
              </div>
              <span className="pp-graph-label">Completed</span>
            </div>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="pp-reset-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowResetConfirm(false)}
          >
            <motion.div
              className="pp-reset-modal"
              initial={{ scale: 0.92, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="pp-reset-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h4>Reset All Progress?</h4>
              <p>This will permanently erase your reading history and completed surahs. You cannot undo this.</p>
              <div className="pp-reset-actions">
                <button className="pp-btn-cancel" onClick={() => setShowResetConfirm(false)}>
                  Cancel
                </button>
                <button
                  className="pp-btn-destructive"
                  onClick={() => { resetProgress(); setShowResetConfirm(false); }}
                >
                  Yes, Reset
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProgressPage;
