import React, { createContext, useContext, useCallback } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from './AuthContext';
import { getBookmarks, createBookmark, deleteBookmark } from '../services/qfUserApi';
import type { Bookmark } from '../types/quran';

interface BookmarkContextType {
  bookmarks: Bookmark[];
  addBookmark: (bookmark: Bookmark) => void;
  removeBookmark: (verseKey: string) => void;
  updateNote: (verseKey: string, note: string) => void;
  isBookmarked: (verseKey: string) => boolean;
  bookmarksCount: number;
}

const BookmarkContext = createContext<BookmarkContextType | null>(null);

export const BookmarkProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const bm = useBookmarks();
  const { isAuthenticated, getAccessToken } = useAuth();

  const addBookmark = useCallback((bookmark: Bookmark) => {
    bm.addBookmark(bookmark);
    if (!isAuthenticated) return;
    getAccessToken().then(token => {
      if (token) createBookmark(token, bookmark.verseKey, bookmark.note).catch(() => {});
    }).catch(() => {});
  }, [bm, isAuthenticated, getAccessToken]);

  const removeBookmark = useCallback((verseKey: string) => {
    bm.removeBookmark(verseKey);
    if (!isAuthenticated) return;
    getAccessToken().then(async token => {
      if (!token) return;
      try {
        const res = await getBookmarks(token);
        if (res.data) {
          const cloud = res.data.find((b: any) => b.verseKey === verseKey || b.verse_key === verseKey);
          if (cloud?.id) deleteBookmark(token, cloud.id).catch(() => {});
        }
      } catch {}
    }).catch(() => {});
  }, [bm, isAuthenticated, getAccessToken]);

  return (
    <BookmarkContext.Provider value={{
      bookmarks: bm.bookmarks,
      addBookmark,
      removeBookmark,
      updateNote: bm.updateNote,
      isBookmarked: bm.isBookmarked,
      bookmarksCount: bm.bookmarksCount,
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
