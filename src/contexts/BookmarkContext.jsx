import React, { createContext, useContext, useState } from 'react';

const BookmarkContext = createContext();

export const useBookmark = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmark must be used within a BookmarkProvider');
  }
  return context;
};

export const BookmarkProvider = ({ children }) => {
  const [bookmarks, setBookmarks] = useState(new Map()); // Map으로 변경하여 기사 데이터 저장

  const toggleBookmark = (articleId, articleData = null) => {
    setBookmarks(prev => {
      const newBookmarks = new Map(prev);
      if (newBookmarks.has(articleId)) {
        newBookmarks.delete(articleId);
      } else {
        newBookmarks.set(articleId, articleData || { id: articleId, title: '기사 제목', url: articleId });
      }
      return newBookmarks;
    });
  };

  const isBookmarked = (articleId) => {
    return bookmarks.has(articleId);
  };

  const getBookmarkCount = () => {
    return bookmarks.size;
  };

  const getBookmarkList = () => {
    return Array.from(bookmarks.values());
  };

  return (
    <BookmarkContext.Provider value={{
      bookmarks,
      toggleBookmark,
      isBookmarked,
      getBookmarkCount,
      getBookmarkList
    }}>
      {children}
    </BookmarkContext.Provider>
  );
};