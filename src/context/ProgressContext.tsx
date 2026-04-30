import React, { createContext, useContext } from 'react';
import { useReadingProgress } from '../hooks/useReadingProgress';
import type { DailyActivity, ReadingRecord } from '../types/quran';

interface ProgressContextType {
  records: Record<number, ReadingRecord>;
  markSurahCompleted: (surahId: number) => void;
  isSurahCompleted: (surahId: number) => boolean;
  completedCount: number;
  progress: number;
  recentActivity: DailyActivity[];
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const readingProgress = useReadingProgress();
  return (
    <ProgressContext.Provider value={readingProgress}>
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
