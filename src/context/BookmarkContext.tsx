import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getBookmarks, createBookmark, deleteBookmark } from '../services/qfUserApi';
import type { Bookmark } from '../types/quran';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  loading: boolean;
  error: string;
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (verseKey: string) => void;
  updateNote: (verseKey: string, note: string) => void;
  isBookmarked: (verseKey: string) => boolean;
  bookmarksCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

function parseVerseKey(vk: string): { surahId: number; verseNumber: number } {
  const p = vk.split(':');
  return { surahId: parseInt(p[0]), verseNumber: parseInt(p[1]) };
}

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) { setBookmarks([]); return; }
    setLoading(true);
    setError('');
    const token = await getAccessToken();
    if (!token) { setLoading(false); return; }
    const res = await getBookmarks(token);
    if (res.data) {
      const mapped: Bookmark[] = res.data.map((b: any) => ({
        verseKey: `${b.key}:${b.verseNumber}`,
        surahId: b.key,
        verseNumber: b.verseNumber,
        surahName: '',
        arabicText: '',
        translation: '',
        note: '',
        createdAt: b.createdAt || new Date().toISOString(),
      }));
      setBookmarks(mapped);
    } else {
      setError(res.error || 'Failed to load');
    }
    setLoading(false);
  }, [isAuthenticated, getAccessToken]);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const addBookmark = useCallback(async (bookmark: Bookmark) => {
    const token = await getAccessToken();
    if (!token) return;
    const { surahId, verseNumber } = parseVerseKey(bookmark.verseKey);
    const res = await createBookmark(token, surahId, verseNumber);
    if (res.data) {
      setBookmarks(prev => [{
        ...bookmark,
        createdAt: res.data.data?.createdAt || new Date().toISOString(),
      }, ...prev]);
    }
  }, [getAccessToken]);

  const removeBookmark = useCallback(async (verseKey: string) => {
    const token = await getAccessToken();
    if (!token) return;
    const { surahId, verseNumber } = parseVerseKey(verseKey);
    const existing = bookmarks.find(b => b.surahId === surahId && b.verseNumber === verseNumber);
    const res = await getBookmarks(token);
    if (res.data) {
      const cloud = res.data.find((b: any) => b.key === surahId && b.verseNumber === verseNumber);
      if (cloud?.id) {
        await deleteBookmark(token, cloud.id);
        setBookmarks(prev => prev.filter(b => b.verseKey !== verseKey));
      }
    } else if (existing) {
      setBookmarks(prev => prev.filter(b => b.verseKey !== verseKey));
    }
  }, [getAccessToken, bookmarks]);

  const updateNote = useCallback(async (verseKey: string, note: string) => {
    setBookmarks(prev => prev.map(b => b.verseKey === verseKey ? { ...b, note } : b));
  }, []);

  const isBookmarked = useCallback((verseKey: string): boolean => {
    return bookmarks.some(b => b.verseKey === verseKey);
  }, [bookmarks]);

  return (
    <BookmarkContext.Provider value={{
      bookmarks, loading, error,
      addBookmark, removeBookmark, updateNote, isBookmarked,
      bookmarksCount: bookmarks.length,
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmark must be used within BookmarkProvider');
  return ctx;
};
