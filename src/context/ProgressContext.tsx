import React, { createContext, useContext, useCallback } from 'react';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useAuth } from './AuthContext';
import { addActivityDay } from '../services/qfUserApi';
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

  const markSurahCompleted = useCallback(
    async (surahId: number, versesCount?: number) => {
      readingProgress.markSurahCompleted(surahId, versesCount);

      if (!isAuthenticated) return;
      const token = await getAccessToken();
      if (!token) return;

      const count = versesCount || 0;
      const date = new Date().toISOString().split('T')[0];
      await addActivityDay(token, {
        ranges: [`${surahId}:1-${surahId}:${count || 1}`],
        seconds: count * 30,
        date,
      });
    },
    [readingProgress, isAuthenticated, getAccessToken]
  );

  const value: ProgressContextType = {
    ...readingProgress,
    markSurahCompleted,
  };

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
