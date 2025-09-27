import React, { createContext, useContext } from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useScrollHider from '../src/shared/components/ui/ScrollHider';

interface HeaderContextType {
  headerHeight: number;
  safeAreaTop: number;
  headerContentHeight: number;
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
  customHeaderContentHeight?: number;
  bottomPadding?: number;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ 
  children, 
  customHeaderContentHeight,
  bottomPadding = 0
}) => {
  const insets = useSafeAreaInsets();
  const { handleScroll } = useScrollHider();
  
  // Calculate proper header height: safe area + header content height + bottom padding
  const headerContentHeight = customHeaderContentHeight || (Platform.OS === "ios" ? 44 : 56);
  const headerHeight = insets.top + headerContentHeight + bottomPadding;

  const contextValue = {
    headerHeight,
    safeAreaTop: insets.top,
    headerContentHeight,
    handleScroll,
  };

  return (
    <HeaderContext.Provider value={contextValue}>
      {children}
    </HeaderContext.Provider>
  );
}; 