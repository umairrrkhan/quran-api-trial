import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressJourney from '../components/ProgressJourney';
import { useProgress } from '../context/ProgressContext';
import { fetchChapters } from '../services/quranApi';
import type { Chapter } from '../types/quran';
import jsPDF from 'jspdf';
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

const motivationalMessages = [
  { verse: 'So verily, with every difficulty there is ease.', ref: 'Quran 94:5' },
  { verse: 'And whoever puts their trust in Allah, He is sufficient for them.', ref: 'Quran 65:3' },
  { verse: 'Allah does not burden a soul more than it can bear.', ref: 'Quran 2:286' },
  { verse: 'Indeed, with hardship comes ease.', ref: 'Quran 94:6' },
  { verse: 'And your Lord is the Generous, who taught by the pen.', ref: 'Quran 96:3-4' },
  { verse: 'The best of you are those who learn the Quran and teach it.', ref: 'Prophet Muhammad (PBUH)' },
  { verse: 'Read! In the name of your Lord who created.', ref: 'Quran 96:1' },
  { verse: 'And We have certainly made the Quran easy to remember.', ref: 'Quran 54:17' },
];

const fallbackChapterNames: Record<number, string> = {
  1: 'Al-Fatihah', 2: 'Al-Baqarah', 3: "Ali 'Imran", 4: 'An-Nisa', 5: "Al-Ma'idah",
  6: "Al-An'am", 7: 'Al-A\'raf', 8: 'Al-Anfal', 9: 'At-Tawbah', 10: 'Yunus',
  11: 'Hud', 12: 'Yusuf', 13: 'Ar-Ra\'d', 14: 'Ibrahim', 15: 'Al-Hijr',
  16: 'An-Nahl', 17: 'Al-Isra', 18: 'Al-Kahf', 19: 'Maryam', 20: 'Ta-Ha',
};

const ProgressPage: React.FC = () => {
  const { progress, completedCount, records, isSurahCompleted, resetProgress } = useProgress();
  const remaining = 114 - completedCount;
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [exporting, setExporting] = useState<'csv' | 'txt' | 'pdf' | null>(null);

  const completedSurahs = useMemo(
    () => surahs.filter((id) => isSurahCompleted(id)),
    [isSurahCompleted]
  );

  useEffect(() => {
    fetchChapters().then((data) => setChapters(data)).catch(() => {});
  }, []);

  const getChapterName = useCallback((id: number): string => {
    const found = chapters.find((c) => c.id === id);
    return found ? found.name_simple : fallbackChapterNames[id] || `Surah ${id}`;
  }, [chapters]);

  const formatDate = (dateStr: string): string => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return dateStr; }
  };

  const dailyMotivation = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return motivationalMessages[dayOfYear % motivationalMessages.length];
  }, []);

  const exportCSV = () => {
    setExporting('csv');
    const rows = [['Surah #', 'Name', 'Completed Date']];
    completedSurahs.forEach((id) => {
      rows.push([String(id), getChapterName(id), formatDate(records[id]?.completedDate || '')]);
    });
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `quran-progress-${new Date().toISOString().split('T')[0]}.csv`;
    a.click(); URL.revokeObjectURL(url);
    setExporting(null);
  };

  const exportTXT = () => {
    setExporting('txt');
    const lines: string[] = [
      '========================================',
      '        MY QURAN READING PROGRESS       ',
      '========================================',
      `Exported on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
      '',
      `Completed: ${completedCount} / 114 (${progress}%)`,
      `Remaining: ${remaining}`,
      '',
      '========================================',
      '         COMPLETED SURAHS              ',
      '========================================',
    ];
    completedSurahs.forEach((id) => {
      lines.push(`${String(id).padStart(3)}. ${getChapterName(id).padEnd(25)} ${formatDate(records[id]?.completedDate || '')}`);
    });
    if (completedSurahs.length === 0) lines.push('  No surahs completed yet.');
    lines.push('', '========================================', '  "The best of you are those who learn the', '   Quran and teach it."', '========================================');
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `quran-progress-${new Date().toISOString().split('T')[0]}.txt`;
    a.click(); URL.revokeObjectURL(url);
    setExporting(null);
  };

  const exportPDF = () => {
    setExporting('pdf');
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentW = pw - margin * 2;
      let y = margin;

      const gold = '#D4AF37';
      const goldDark = '#B8962E';
      const dark = '#1E293B';
      const gray = '#CBD5E1';

      const addFooter = () => {
        pdf.setDrawColor(212, 175, 55);
        pdf.setLineWidth(0.3);
        const fw = 50;
        pdf.line((pw - fw) / 2, ph - 14, (pw + fw) / 2, ph - 14);
        pdf.setFontSize(8);
        pdf.setTextColor(180, 150, 46);
        pdf.setFont('helvetica', 'italic');
        pdf.text('"The best of you are those who learn the Quran and teach it."', pw / 2, ph - 8, { align: 'center' });
        pdf.setTextColor(148, 163, 184);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text(`Generated by Quran Journey Tracker · ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, pw / 2, ph - 3, { align: 'center' });
      };

      const checkPage = (needed: number) => {
        if (y + needed > ph - margin) {
          addFooter();
          pdf.addPage();
          y = margin;
        }
      };

      // Top ornament
      pdf.setDrawColor(212, 175, 55);
      pdf.setFillColor(212, 175, 55);
      for (let i = 0; i < 3; i++) {
        const shade = i === 1 ? '#E8C44A' : i === 0 ? '#D4AF37' : '#B8962E';
        pdf.setFillColor(shade === '#D4AF37' ? 212 : shade === '#E8C44A' ? 232 : 184, shade === '#D4AF37' ? 175 : shade === '#E8C44A' ? 196 : 150, shade === '#D4AF37' ? 55 : shade === '#E8C44A' ? 74 : 46);
        pdf.rect(0, y, pw, 2, 'F');
        y += 2;
      }
      y += 6;

      // Header
      pdf.setFillColor(255, 251, 235);
      pdf.rect(0, 0, pw, y - 6, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(18);
      pdf.setTextColor(30, 41, 59);
      pdf.text('My Quran Reading Progress', pw / 2, y, { align: 'center' });
      y += 8;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(148, 163, 184);
      const dateStr = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
      pdf.text(dateStr, pw / 2, y, { align: 'center' });
      y += 16;

      // Stats boxes
      const stats = [
        { label: 'Surahs Completed', value: String(completedCount), color: [34, 197, 94], fillColor: [240, 253, 244] },
        { label: 'Overall Progress', value: `${progress}%`, color: [212, 175, 55], fillColor: [255, 251, 235] },
        { label: 'Remaining', value: String(remaining), color: [148, 163, 184], fillColor: [248, 249, 252] },
      ];
      const boxW = (contentW - 8) / 3;
      stats.forEach((s, i) => {
        const bx = margin + i * (boxW + 4);
        pdf.setFillColor(s.fillColor[0], s.fillColor[1], s.fillColor[2]);
        pdf.setDrawColor(s.color[0], s.color[1], s.color[2]);
        pdf.setLineWidth(0.5);
        pdf.roundedRect(bx, y, boxW, 32, 2, 2, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.setTextColor(15, 23, 42);
        pdf.text(s.value, bx + boxW / 2, y + 12, { align: 'center' });
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        pdf.setTextColor(148, 163, 184);
        pdf.text(s.label.toUpperCase(), bx + boxW / 2, y + 22, { align: 'center' });
      });
      y += 44;

      // Divider
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y, pw - margin, y);
      y += 12;

      // Section: Completion overview grid
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(184, 150, 46);
      pdf.text('COMPLETION OVERVIEW', margin, y);
      y += 10;

      const cols = 19;
      const cellSize = 4;
      const gap = 1.2;
      const gridW = cols * (cellSize + gap) - gap;
      const startX = (pw - gridW) / 2;

      for (let row = 0; row < Math.ceil(114 / cols); row++) {
        for (let col = 0; col < cols; col++) {
          const id = row * cols + col + 1;
          if (id > 114) break;
          const done = completedSurahs.includes(id);
          const cx = startX + col * (cellSize + gap);
          const cy = y + row * (cellSize + gap);
          if (done) {
            pdf.setFillColor(212, 175, 55);
            pdf.setDrawColor(212, 175, 55);
          } else {
            pdf.setFillColor(237, 240, 245);
            pdf.setDrawColor(226, 232, 240);
          }
          pdf.roundedRect(cx, cy, cellSize, cellSize, 0.5, 0.5, 'FD');
        }
      }
      y += Math.ceil(114 / cols) * (cellSize + gap) + 6;

      // Legend
      pdf.setFontSize(7);
      const legendItems = [
        { label: `Not started (${remaining})`, color: [237, 240, 245], border: [226, 232, 240], x: pw / 2 - 40 },
        { label: `Completed (${completedCount})`, color: [212, 175, 55], border: [212, 175, 55], x: pw / 2 + 20 },
      ];
      legendItems.forEach((item) => {
        pdf.setFillColor(item.color[0], item.color[1], item.color[2]);
        pdf.setDrawColor(item.border[0], item.border[1], item.border[2]);
        pdf.roundedRect(item.x, y, 8, 8, 1, 1, 'FD');
        pdf.setTextColor(100, 116, 139);
        pdf.setFont('helvetica', 'normal');
        pdf.text(item.label, item.x + 11, y + 6);
      });
      y += 16;

      // Divider
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.2);
      pdf.line(margin, y, pw - margin, y);
      y += 12;

      // Section: All Surahs
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(184, 150, 46);
      pdf.text('ALL SURAHS', margin, y);
      y += 10;

      // Surah rows
      for (let i = 0; i < surahs.length; i++) {
        const id = surahs[i];
        const done = completedSurahs.includes(id);
        checkPage(8);

        const rowH = 6.5;
        const rowY = y;

        // Row bg
        if (done) {
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(212, 175, 55, 0.12 * 255);
        } else {
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(241, 244, 249);
        }
        pdf.setLineWidth(0.3);
        pdf.roundedRect(margin, rowY, contentW, rowH, 2, 2, 'FD');

        // Number circle
        const numCX = margin + 7;
        if (done) {
          pdf.setFillColor(212, 175, 55);
          pdf.setDrawColor(212, 175, 55);
        } else {
          pdf.setFillColor(255, 251, 235);
          pdf.setDrawColor(212, 175, 55, 0.12 * 255);
        }
        pdf.circle(numCX, rowY + rowH / 2, 3.2, 'FD');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(5.5);
        pdf.setTextColor(done ? 255 : 184, done ? 255 : 150, done ? 255 : 46);
        pdf.text(String(id), numCX, rowY + rowH / 2 + 1.8, { align: 'center' });

        // Name
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(7);
        pdf.setTextColor(30, 41, 59);
        const name = getChapterName(id);
        pdf.text(name, margin + 15, rowY + rowH / 2 + 1.5);

        // Status
        const statusX = pw - margin - 55;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(6.5);
        if (done) {
          pdf.setTextColor(34, 197, 94);
          pdf.text('✓ Completed', statusX, rowY + rowH / 2 + 1.5);
        } else {
          pdf.setTextColor(148, 163, 184);
          pdf.text('○ Not Started', statusX, rowY + rowH / 2 + 1.5);
        }

        // Date
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6);
        pdf.setTextColor(148, 163, 184);
        const dateVal = done ? formatDate(records[id]?.completedDate || '') : '—';
        pdf.text(dateVal, pw - margin - 8, rowY + rowH / 2 + 1.5, { align: 'right' });

        y += rowH + 2;
      }

      // Footer on last page
      addFooter();
      pdf.save(`quran-progress-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Could not generate PDF. Try exporting as CSV or TXT instead.');
    }
    setExporting(null);
  };

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
              <div className="pp-header-actions">
                <div className="pp-export-group">
                  <button className="pp-export-btn" onClick={exportCSV} disabled={exporting !== null} title="Export as CSV">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" />
                    </svg>
                    {exporting === 'csv' ? 'Exporting...' : 'CSV'}
                  </button>
                  <button className="pp-export-btn" onClick={exportTXT} disabled={exporting !== null} title="Export as TXT">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                    </svg>
                    {exporting === 'txt' ? 'Exporting...' : 'TXT'}
                  </button>
                  <button className="pp-export-btn pp-export-pdf" onClick={exportPDF} disabled={exporting !== null} title="Export as PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /><path d="M16 13H8" /><path d="M16 17H8" /><path d="M10 9H8" />
                    </svg>
                    {exporting === 'pdf' ? 'Exporting...' : 'PDF'}
                  </button>
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

      <section className="pp-motivation-section">
        <div className="container">
          <motion.div
            className="pp-motivation-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="pp-motivation-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </div>
            <div className="pp-motivation-body">
              <p className="pp-motivation-verse">"{dailyMotivation.verse}"</p>
              <p className="pp-motivation-ref">— {dailyMotivation.ref}</p>
              <p className="pp-motivation-cta">
                {completedCount === 0
                  ? 'Start your journey today — even one verse counts.'
                  : `You've completed ${completedCount} surah${completedCount > 1 ? 's' : ''}! Keep the momentum going — read at least one verse daily.`}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="pp-tree-section">
        <div className="container">
          <div className="pp-divider">
            <span className="pp-divider-icon">✦</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <ProgressJourney progress={progress} />
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
