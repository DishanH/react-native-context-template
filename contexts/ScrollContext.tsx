import React, { createContext, useContext } from 'react';

// Create a context to manage scroll position
export const ScrollContext = createContext({
  scrollY: 0,
  setScrollY: (value: number) => {},
  isScrolling: false,
  setIsScrolling: (value: boolean) => {},
});

export const useScrollVisibility = () => useContext(ScrollContext); 