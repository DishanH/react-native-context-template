import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationContextType {
  showBackButton: boolean;
  setShowBackButton: (show: boolean) => void;
  fromDashboard: boolean;
  setFromDashboard: (from: boolean) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [showBackButton, setShowBackButton] = useState(false);
  const [fromDashboard, setFromDashboard] = useState(false);

  return (
    <NavigationContext.Provider
      value={{
        showBackButton,
        setShowBackButton,
        fromDashboard,
        setFromDashboard,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationState() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigationState must be used within a NavigationProvider');
  }
  return context;
}