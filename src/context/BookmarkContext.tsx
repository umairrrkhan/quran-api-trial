import React, { createContext, useContext, useEffect } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
import { useAuth } from './AuthContext';
import { getBookmarks } from '../services/qfUserApi';
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
  const bookmarksData = useBookmarks();
  const { isAuthenticated, getAccessToken } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;
    getAccessToken().then(token => {
      if (!token) return;
      getBookmarks(token).then(res => {
        if (res.data && res.data.length > 0) {
          const existing = bookmarksData.bookmarks;
          const existingKeys = new Set(existing.map(b => b.verseKey));
          let added = 0;
          for (const cb of res.data) {
            if (!existingKeys.has(cb.verseKey)) {
              existingKeys.add(cb.verseKey);
              added++;
            }
          }
        }
      });
    });
  }, [isAuthenticated]);

  return (
    <BookmarkContext.Provider value={bookmarksData}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = (): BookmarkContextType => {
  const context = useContext(BookmarkContext);
  if (!context)
    throw new Error('useBookmark must be used within BookmarkProvider');
  return context;
};
