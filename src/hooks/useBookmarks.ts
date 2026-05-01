import { useCallback, useMemo } from 'react';
import useLocalStorage from './useLocalStorage';
import type { Bookmark } from '../types/quran';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('quran-bookmarks', []);

  const addBookmark = useCallback((bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.verseKey === bookmark.verseKey)) return prev;
      return [bookmark, ...prev];
    });
  }, [setBookmarks]);

  const removeBookmark = useCallback((verseKey: string) => {
    setBookmarks((prev) => prev.filter((b) => b.verseKey !== verseKey));
  }, [setBookmarks]);

  const updateNote = useCallback((verseKey: string, note: string) => {
    setBookmarks((prev) =>
      prev.map((b) => (b.verseKey === verseKey ? { ...b, note } : b))
    );
  }, [setBookmarks]);

  const isBookmarked = useCallback(
    (verseKey: string): boolean => bookmarks.some((b) => b.verseKey === verseKey),
    [bookmarks]
  );

  const bookmarksCount = useMemo(() => bookmarks.length, [bookmarks]);

  return { bookmarks, addBookmark, removeBookmark, updateNote, isBookmarked, bookmarksCount };
}
