import React, { createContext, useContext } from 'react';
import { useBookmarks } from '../hooks/useBookmarks';
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
