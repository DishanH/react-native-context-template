import React, { ReactNode, useEffect, useState } from 'react';
import { ScrollContext } from '../../contexts/ScrollContext';

// Constants
const SCROLL_TIMEOUT = 800; // Time in ms to wait before hiding tab bar
const SCROLL_THRESHOLD = 2; // Minimum scroll distance to trigger hiding/showing

interface ScrollContextProviderProps {
  children: ReactNode;
}

/**
 * Provides scroll position context for hiding/showing the tab bar during scrolling
 */
export default function ScrollContextProvider({ children }: ScrollContextProviderProps) {
  const [scrollY, setScrollY] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollTimer, setScrollTimer] = useState<NodeJS.Timeout | null>(null);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);

  // Handle the end of scrolling with debounce
  const handleScrollEnd = () => {
    if (scrollTimer) {
      clearTimeout(scrollTimer);
    }
    
    const timer = setTimeout(() => {
      setIsScrolling(false);
    }, SCROLL_TIMEOUT);
    
    setScrollTimer(timer as unknown as NodeJS.Timeout);
  };

  // Clean up the timer when component unmounts
  useEffect(() => {
    return () => {
      if (scrollTimer) {
        clearTimeout(scrollTimer);
      }
    };
  }, [scrollTimer]);

  // Create context value object
  const contextValue = {
    scrollY,
    setScrollY: (value: number) => {
      // Determine scroll direction
      const direction = value > lastScrollY ? 'down' : 'up';
      setScrollDirection(direction);
      
      // Check if scroll distance exceeds threshold
      const isScrollingNow = Math.abs(value - lastScrollY) > SCROLL_THRESHOLD;
      
      if (isScrollingNow) {
        // Hide tab bar when scrolling down past initial area
        if (direction === 'down' && value > 10) {
          setIsScrolling(true);
        } else if (direction === 'up') {
          // Show tab bar when scrolling up
          setIsScrolling(false);
        }
        
        handleScrollEnd();
      }
      
      setLastScrollY(value);
      setScrollY(value);
    },
    isScrolling,
    setIsScrolling
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
} 