import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import type { ReadingRecord, DailyActivity } from '../types/quran';

const TOTAL_SURAHS = 114;

export function useReadingProgress() {
  const [records, setRecords] = useLocalStorage<Record<number, ReadingRecord>>(
    'quran-progress',
    {}
  );

  const markSurahCompleted = useCallback(
    (surahId: number) => {
      setRecords((prev) => ({
        ...prev,
        [surahId]: {
          completedDate: new Date().toISOString(),
          versesRead: 0,
          completed: true,
        },
      }));
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

  const resetProgress = useCallback(() => {
    setRecords({});
  }, [setRecords]);

  return {
    records,
    markSurahCompleted,
    isSurahCompleted,
    completedCount,
    progress,
    recentActivity,
    resetProgress,
  };
}
