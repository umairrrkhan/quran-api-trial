import React, { createContext, useContext, useCallback } from 'react';
import { useReadingProgress } from '../hooks/useReadingProgress';
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

  const markSurahCompleted = useCallback(
    async (surahId: number, versesCount?: number) => {
      readingProgress.markSurahCompleted(surahId, versesCount);
    },
    [readingProgress]
  );

  const value: ProgressContextType = { ...readingProgress, markSurahCompleted };

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
