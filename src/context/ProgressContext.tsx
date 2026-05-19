import React, { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { useReadingProgress } from '../hooks/useReadingProgress';
import { useAuth } from './AuthContext';
import { addOrUpdateUserReadingSession, getUserReadingSessions } from '../services/qfUserApi';
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
  const [remoteActivity, setRemoteActivity] = useState<DailyActivity[] | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setRemoteActivity(null);
      return;
    }
    getAccessToken().then(async (token) => {
      if (!token) return;
      const res = await getUserReadingSessions(token);
      if (!res.data) return;
      const sessions = Array.isArray(res.data) ? res.data : (Array.isArray((res.data as any).data) ? (res.data as any).data : []);
      const mapped = sessions.map((s: any) => ({
        date: s.date || s.updatedAt?.split('T')[0] || new Date().toISOString().split('T')[0],
        count: s.versesRead || s.ranges?.length || 1,
      }));
      setRemoteActivity(mapped);
    });
  }, [isAuthenticated, getAccessToken]);

  const markSurahCompleted = useCallback(
    async (surahId: number, versesCount?: number) => {
      readingProgress.markSurahCompleted(surahId, versesCount);

      if (!isAuthenticated) return;
      const token = await getAccessToken();
      if (!token) return;

      const count = versesCount || 0;
      const date = new Date().toISOString().split('T')[0];
      await addOrUpdateUserReadingSession(token, {
        ranges: [`${surahId}:1-${surahId}:${count || 1}`],
        seconds: count * 30,
        date,
      });
    },
    [readingProgress, isAuthenticated, getAccessToken]
  );

  const mergedRecentActivity = useMemo(() => {
    if (!remoteActivity || remoteActivity.length === 0) return readingProgress.recentActivity;
    const map = new Map<string, number>();
    readingProgress.recentActivity.forEach((d) => map.set(d.date, d.count));
    remoteActivity.forEach((d) => map.set(d.date, (map.get(d.date) || 0) + d.count));
    return Array.from(map.entries()).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date));
  }, [readingProgress.recentActivity, remoteActivity]);

  const value: ProgressContextType = { ...readingProgress, recentActivity: mergedRecentActivity, markSurahCompleted };

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
