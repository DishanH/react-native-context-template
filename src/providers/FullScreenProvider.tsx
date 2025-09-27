import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from 'react';
import FullScreenCard from '../../src/shared/components/ui/FullScreenCard';
import { useTheme } from '../../contexts/ThemeContext';

interface FullScreenConfig {
  title: string;
  subtitle?: string;
  icon?: string;
  content: ReactNode;
  onClose?: () => void;
  onOpen?: () => void;
  showBlur?: boolean;
  animationDuration?: number;
  heightPercentage?: number;
}

interface FullScreenContextType {
  openFullScreen: (config: FullScreenConfig) => void;
  closeFullScreen: () => void;
  isFullScreenOpen: boolean;
}

const FullScreenContext = createContext<FullScreenContextType>({
  openFullScreen: () => {},
  closeFullScreen: () => {},
  isFullScreenOpen: false,
});

export const useFullScreen = () => useContext(FullScreenContext);

export const FullScreenProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<FullScreenConfig | null>(null);
  const { colors } = useTheme();

  const openFullScreen = useCallback((fullScreenConfig: FullScreenConfig) => {
    setConfig(fullScreenConfig);
    setIsOpen(true);
  }, []);

  const closeFullScreen = useCallback(() => {
    setIsOpen(false);
    if (config?.onClose) {
      config.onClose();
    }
    // Clear config after animation completes
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, [config]);

  return (
    <FullScreenContext.Provider
      value={{
        openFullScreen,
        closeFullScreen,
        isFullScreenOpen: isOpen,
      }}
    >
      {children}
      
      {config && (
        <FullScreenCard
          visible={isOpen}
          title={config.title}
          subtitle={config.subtitle}
          icon={config.icon as any}
          onClose={closeFullScreen}
          colors={colors}
          onOpen={config.onOpen}
          showBlur={config.showBlur}
          animationDuration={config.animationDuration}
          heightPercentage={config.heightPercentage}
        >
          {config.content}
        </FullScreenCard>
      )}
    </FullScreenContext.Provider>
  );
};

export default FullScreenProvider;
