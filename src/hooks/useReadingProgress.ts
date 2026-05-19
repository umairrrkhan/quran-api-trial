import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import type { ReadingRecord, DailyActivity } from '../types/quran';

const TOTAL_SURAHS = 114;

export function useReadingProgress() {
  const [records, setRecords] = useLocalStorage<Record<number, ReadingRecord>>(
    'quran-progress',
    {}
  );

  const [dailyGoal, setDailyGoal] = useLocalStorage<number>('quran-daily-goal', 5);

  const markSurahCompleted = useCallback(
    (surahId: number, versesCount?: number) => {
      setRecords((prev) => {
        if (prev[surahId]?.completed) {
          const { [surahId]: _, ...rest } = prev;
          return rest;
        }
        return {
          ...prev,
          [surahId]: {
            completedDate: new Date().toISOString(),
            versesRead: versesCount || 0,
            completed: true,
          },
        };
      });
    },
    [setRecords]
  );

  const isSurahCompleted = useCallback(
    (surahId: number): boolean => {
      return records[surahId]?.completed || false;
    },
    [records]
  );

  const completedCount = useMemo(
    () => Object.values(records).filter((r) => r.completed).length,
    [records]
  );

  const progress = useMemo(
    () => Math.round((completedCount / TOTAL_SURAHS) * 100),
    [completedCount]
  );

  const todayStr = new Date().toISOString().split('T')[0];

  const todayVerses = useMemo(() => {
    return Object.values(records).reduce((sum, r) => {
      if (r.completed && r.completedDate.split('T')[0] === todayStr) {
        return sum + (r.versesRead || 0);
      }
      return sum;
    }, 0);
  }, [records]);

  const todayGoalMet = useMemo(() => todayVerses >= dailyGoal, [todayVerses, dailyGoal]);

  const todayProgress = useMemo(() => Math.min(Math.round((todayVerses / dailyGoal) * 100), 100), [todayVerses, dailyGoal]);

  const recentActivity = useMemo((): DailyActivity[] => {
    const days: DailyActivity[] = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      days.push({ date: dateStr, count: 0 });
    }
    const activityMap: Record<string, number> = {};
    Object.values(records).forEach((record) => {
      const date = record.completedDate.split('T')[0];
      activityMap[date] = (activityMap[date] || 0) + 1;
    });
    return days.map((day) => ({
      ...day,
      count: activityMap[day.date] || 0,
    }));
  }, [records]);

  const streakData = useMemo(() => {
    const activeDates = new Set<string>();
    Object.values(records).forEach((r) => {
      if (r.completed) activeDates.add(r.completedDate.split('T')[0]);
    });

    const sorted = Array.from(activeDates).sort().reverse();
    const lastReadDate = sorted.length > 0 ? sorted[0] : null;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let currentStreak = 0;
    if (activeDates.has(today) || activeDates.has(yesterday)) {
      const start = activeDates.has(today) ? today : yesterday;
      let cursor = new Date(start);
      while (true) {
        const ds = cursor.toISOString().split('T')[0];
        if (activeDates.has(ds)) {
          currentStreak++;
          cursor.setDate(cursor.getDate() - 1);
        } else break;
      }
    }

    let longestStreak = 0;
    if (sorted.length > 0) {
      let streak = 1;
      for (let i = 0; i < sorted.length - 1; i++) {
        const curr = new Date(sorted[i]);
        const next = new Date(sorted[i + 1]);
        const diff = (curr.getTime() - next.getTime()) / 86400000;
        if (Math.round(diff) === 1) {
          streak++;
        } else {
          if (streak > longestStreak) longestStreak = streak;
          streak = 1;
        }
      }
      if (streak > longestStreak) longestStreak = streak;
    }

    const todayDone = activeDates.has(today);
    const atRisk = !todayDone && sorted.length > 0 && sorted[0] === yesterday;

    return { currentStreak, longestStreak, lastReadDate, todayDone, atRisk };
  }, [records]);

  const resetProgress = useCallback(() => {
    setRecords({});
  }, [setRecords]);

  return {
    records,
    markSurahCompleted,
    isSurahCompleted,
    completedCount,
    progress,
    todayVerses,
    todayGoalMet,
    todayProgress,
    dailyGoal,
    setDailyGoal,
    recentActivity,
    resetProgress,
    ...streakData,
  };
}
