import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useScrollHider from '../src/shared/components/ui/ScrollHider';

interface HeaderContextType {
  headerHeight: number;
  safeAreaTop: number;
  handleScroll: (event: any) => void;
}

const HeaderContext = createContext<HeaderContextType | null>(null);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider');
  }
  return context;
};

interface HeaderProviderProps {
  children: React.ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const { handleScroll } = useScrollHider();
  
  // Calculate header height for padding
  const headerHeight = Platform.OS === "ios" ? 44 + insets.top : 56 + insets.top;

  const contextValue = {
    headerHeight,
    safeAreaTop: insets.top,
    handleScroll,
  };

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
}; 