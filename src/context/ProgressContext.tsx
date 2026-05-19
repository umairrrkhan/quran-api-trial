import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useAuth } from './AuthContext';
import { getStreaks, getCurrentStreakDays } from '../services/qfUserApi';
import type { DailyActivity, ReadingRecord } from '../types/quran';

interface ProgressContextType {
  records: Record<number, ReadingRecord>;
  markSurahCompleted: (surahId: number, versesCount?: number) => void;
  isSurahCompleted: (surahId: number) => boolean;
  completedCount: number;
  progress: number;
  todayVerses: number;
  todayGoalMet: boolean;
  todayProgress: number;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  recentActivity: DailyActivity[];
  resetProgress: () => void;
  currentStreak: number;
  longestStreak: number;
  lastReadDate: string | null;
  todayDone: boolean;
  atRisk: boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const readingProgress = useReadingProgress();
  const { isAuthenticated, getAccessToken } = useAuth();
  const [apiCurrentStreak, setApiCurrentStreak] = useState<number | null>(null);
  const [apiLongestStreak, setApiLongestStreak] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setApiCurrentStreak(null);
      setApiLongestStreak(null);
      return;
    }
    getAccessToken().then(async (token) => {
      if (!token) return;
      const [currentRes, streaksRes] = await Promise.all([
        getCurrentStreakDays(token),
        getStreaks(token),
      ]);
      if (currentRes.data) {
        const days = Array.isArray(currentRes.data) ? null : (currentRes.data as any).days;
        if (typeof days === 'number') setApiCurrentStreak(days);
      }
      if (streaksRes.data) {
        const list = Array.isArray(streaksRes.data) ? streaksRes.data : (Array.isArray((streaksRes.data as any).data) ? (streaksRes.data as any).data : []);
        if (list.length > 0) {
          const maxDays = Math.max(...list.map((s: any) => s.days || 0));
          if (maxDays > 0) setApiLongestStreak(maxDays);
        }
      }
    });
  }, [isAuthenticated, getAccessToken]);

  const currentStreak = apiCurrentStreak !== null ? apiCurrentStreak : readingProgress.currentStreak;
  const longestStreak = apiLongestStreak !== null ? apiLongestStreak : readingProgress.longestStreak;

  const markSurahCompleted = useCallback(
    async (surahId: number, versesCount?: number) => {
      readingProgress.markSurahCompleted(surahId, versesCount);
    },
    [readingProgress]
  );

  const value: ProgressContextType = { ...readingProgress, currentStreak, longestStreak, markSurahCompleted };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = (): ProgressContextType => {
  const context = useContext(ProgressContext);
  if (!context)
    throw new Error('useProgress must be used within ProgressProvider');
  return context;
};
