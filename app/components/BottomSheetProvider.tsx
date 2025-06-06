import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from "@gorhom/bottom-sheet";
import React, { createContext, ReactNode, useCallback, useContext, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useTheme } from '../../contexts';

// Define the context type
interface BottomSheetContextType {
  openBottomSheet: (content: ReactNode, height?: string) => void;
  closeBottomSheet: () => void;
  isBottomSheetOpen: boolean;
}

// Create the context with default values
const BottomSheetContext = createContext<BottomSheetContextType>({
  openBottomSheet: () => {},
  closeBottomSheet: () => {},
  isBottomSheetOpen: false,
});

// Hook to use the bottom sheet context
export const useBottomSheet = () => useContext(BottomSheetContext);

// Provider component
export const BottomSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState<ReactNode>(null);
  const [height, setHeight] = useState<string>('50%');
  const { colors } = useTheme();
  
  const sheetRef = useRef<BottomSheet>(null);

  // Function to open the bottom sheet
  const openBottomSheet = useCallback((newContent: ReactNode, newHeight?: string) => {
    setContent(newContent);
    if (newHeight) {
      setHeight(newHeight);
    }
    setIsOpen(true);
    setTimeout(() => {
      sheetRef.current?.snapToIndex(0);
    }, 100);
  }, []);

  // Function to close the bottom sheet
  const closeBottomSheet = useCallback(() => {
    sheetRef.current?.close();
  }, []);

  // Handle sheet changes
  const handleSheetChange = useCallback((index: number) => {
    if (index === -1) {
      setIsOpen(false);
    }
  }, []);

  // Backdrop component for the bottom sheet
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={closeBottomSheet}
      />
    ),
    [closeBottomSheet]
  );

  return (
    <BottomSheetContext.Provider
      value={{
        openBottomSheet,
        closeBottomSheet,
        isBottomSheetOpen: isOpen,
      }}
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        {children}
        {isOpen && (
          <BottomSheet
            ref={sheetRef}
            snapPoints={[height]}
            enableDynamicSizing={false}
            enablePanDownToClose={true}
            onChange={handleSheetChange}
            index={-1}
            handleIndicatorStyle={{ backgroundColor: colors.border }}
            backgroundStyle={{ backgroundColor: colors.background }}
            backdropComponent={renderBackdrop}
          >
            <BottomSheetView style={{ flex: 1, backgroundColor: colors.background }}>
              {content}
            </BottomSheetView>
          </BottomSheet>
        )}
      </GestureHandlerRootView>
    </BottomSheetContext.Provider>
  );
}; 