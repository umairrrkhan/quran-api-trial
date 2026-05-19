import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { getBookmarks, createBookmark, deleteBookmark } from '../services/qfUserApi';
import { fetchVerseByKey } from '../services/quranApi';
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
  const [surah, verse] = vk.split(':');
  return { surahId: parseInt(surah, 10), verseNumber: parseInt(verse, 10) };
}

function toVerseKey(raw: any): string {
  if (typeof raw?.verseKey === 'string' && raw.verseKey.includes(':')) return raw.verseKey;
  if (typeof raw?.key === 'string' && raw.key.includes(':')) return raw.key;
  if (typeof raw?.key === 'number' && typeof raw?.verseNumber === 'number') return `${raw.key}:${raw.verseNumber}`;
  return '';
}

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bookmarkIdsRef = useRef<Map<string, string>>(new Map());

  const fetchBookmarks = useCallback(async () => {
    if (!isAuthenticated) {
      bookmarkIdsRef.current = new Map();
      setBookmarks([]);
      return;
    }

    setLoading(true);
    setError('');
    const token = await getAccessToken();
    if (!token) {
      setLoading(false);
      return;
    }

    const res = await getBookmarks(token);
    if (!res.data) {
      setError(res.error || 'Failed to load');
      setLoading(false);
      return;
    }

    const items = Array.isArray(res.data) ? res.data : (Array.isArray((res.data as any).data) ? (res.data as any).data : []);

    const mapped = await Promise.all(items.map(async (b: any): Promise<Bookmark | null> => {
      const verseKey = toVerseKey(b);
      if (!verseKey) return null;
      const { surahId, verseNumber } = parseVerseKey(verseKey);
      bookmarkIdsRef.current.set(verseKey, b.id);

      const verse = await fetchVerseByKey(verseKey);
      const words = verse?.words?.filter((w: any) => w.char_type_name === 'word') || [];
      const translation = words.map((w: any) => w.translation?.text || '').join(' ').trim();

      return {
        verseKey,
        surahId,
        verseNumber,
        surahName: `Surah ${surahId}`,
        arabicText: words.map((w: any) => w.text_uthmani || w.text || '').join(' ').trim(),
        translation,
        note: '',
        createdAt: b.createdAt || new Date().toISOString(),
      };
    }));

    setBookmarks(mapped.filter((b): b is Bookmark => !!b));
    setError('');
    setLoading(false);
  }, [isAuthenticated, getAccessToken]);

  useEffect(() => { fetchBookmarks(); }, [fetchBookmarks]);

  const addBookmark = useCallback(async (bookmark: Bookmark) => {
    const token = await getAccessToken();
    if (!token) return;

    const { surahId, verseNumber } = parseVerseKey(bookmark.verseKey);
    const res = await createBookmark(token, surahId, verseNumber);
    if (res.error) {
      setError(res.error);
      return;
    }

    const created = res.data?.data || res.data;
    const bookmarkId = created?.id;
    if (bookmarkId) bookmarkIdsRef.current.set(bookmark.verseKey, bookmarkId);

    setBookmarks(prev => {
      if (prev.some((b) => b.verseKey === bookmark.verseKey)) return prev;
      return [{ ...bookmark, createdAt: created?.createdAt || new Date().toISOString() }, ...prev];
    });
  }, [getAccessToken]);

  const removeBookmark = useCallback(async (verseKey: string) => {
    const token = await getAccessToken();
    if (!token) return;

    let bookmarkId: string | undefined = bookmarkIdsRef.current.get(verseKey);
    if (!bookmarkId) {
      const latest = await getBookmarks(token);
      if (!latest.data) return;
      const latestItems = Array.isArray(latest.data) ? latest.data : (Array.isArray((latest.data as any).data) ? (latest.data as any).data : []);
      const match = latestItems.find((b: any) => toVerseKey(b) === verseKey);
      if (!match?.id) return;
      bookmarkId = match.id;
    }

    const res = await deleteBookmark(token, bookmarkId!);
    if (res.error) {
      setError(res.error);
      return;
    }
    bookmarkIdsRef.current.delete(verseKey);
    setBookmarks(prev => prev.filter(b => b.verseKey !== verseKey));
  }, [getAccessToken]);

  const updateNote = useCallback(async (verseKey: string, note: string) => {
    setBookmarks(prev => prev.map(b => b.verseKey === verseKey ? { ...b, note } : b));
  }, []);

  const isBookmarked = useCallback((verseKey: string): boolean => bookmarks.some(b => b.verseKey === verseKey), [bookmarks]);

  return (
    <BookmarkContext.Provider value={{ bookmarks, loading, error, addBookmark, removeBookmark, updateNote, isBookmarked, bookmarksCount: bookmarks.length }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const ctx = useContext(BookmarkContext);
  if (!ctx) throw new Error('useBookmark must be used within BookmarkProvider');
  return ctx;
};
