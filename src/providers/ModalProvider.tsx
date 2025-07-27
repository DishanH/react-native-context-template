import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts";

// Define the context type
interface ModalContextType {
  openModal: (config: ModalConfig) => void;
  closeModal: () => void;
  isModalOpen: boolean;
}

interface ModalConfig {
  title: string;
  subtitle?: string;
  content: ReactNode;
  icon?: keyof typeof Ionicons.glyphMap;
  onClose?: () => void;
}

// Create the context with default values
const ModalContext = createContext<ModalContextType>({
  openModal: () => {},
  closeModal: () => {},
  isModalOpen: false,
});

// Hook to use the modal context
export const useModal = () => useContext(ModalContext);

// Modern Modal Header Component
const ModernModalHeader: React.FC<{
  title: string;
  subtitle?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onClose: () => void;
  scrollY: number;
  colors: any;
}> = ({ title, subtitle, icon, onClose, scrollY, colors }) => {
  const headerOpacity = Math.min(scrollY / 50, 0.95);

  return (
    <View
      style={[
        styles.thinModalHeader,
        {
          backgroundColor:
            colors.background +
            Math.round(headerOpacity * 255)
              .toString(16)
              .padStart(2, "0"),
        },
      ]}
    >
      {/* Drag Indicator */}
      <View style={styles.compactDragIndicator}>
        <View style={[styles.dragHandle, { backgroundColor: colors.border }]} />
      </View>

      {/* Compact Header Content */}
      <View style={styles.compactHeaderContent}>
        <TouchableOpacity
          onPress={onClose}
          style={[
            styles.compactCloseButton,
            { backgroundColor: colors.surface },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="close" size={18} color={colors.textSecondary} />
        </TouchableOpacity>

        <View style={styles.compactHeaderCenter}>
          <Text style={[styles.compactModalTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.compactModalSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {icon && (
          <TouchableOpacity
            style={[
              styles.compactHeaderAction,
              { backgroundColor: colors.primary + "15" },
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name={icon} size={16} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

// Provider component
export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<ModalConfig | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const { colors } = useTheme();

  // Calculate dynamic keyboard offset based on screen dimensions
  const getKeyboardOffset = () => {
    if (Platform.OS === 'android') return 20;
    
    const { height } = Dimensions.get('window');
    const statusBarHeight = StatusBar.currentHeight || 0;
    
    // Calculate offset based on screen height
    // Smaller screens need less offset, larger screens need more
    if (height <= 667) { // iPhone SE, iPhone 8
      return 60;
    } else if (height <= 736) { // iPhone 8 Plus
      return 70;
    } else if (height <= 812) { // iPhone X, iPhone 12 mini
      return 75;
    } else if (height <= 896) { // iPhone XR, iPhone 11, iPhone 14
      return 80;
    } else { // iPhone 12 Pro Max, iPhone 14 Pro Max
      return 85;
    }
  };

  // Function to open the modal
  const openModal = useCallback((modalConfig: ModalConfig) => {
    setConfig(modalConfig);
    setIsOpen(true);
    setScrollY(0); // Reset scroll position
  }, []);

  // Function to close the modal
  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (config?.onClose) {
      config.onClose();
    }
    setTimeout(() => {
      setConfig(null);
    }, 300);
  }, [config]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    setScrollY(offsetY);
  };

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        isModalOpen: isOpen,
      }}
    >
      {children}

            {config && (
        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModal}
        >
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={getKeyboardOffset()}
          >
            <View
              style={[
                styles.modalContainer,
                { backgroundColor: colors.background },
              ]}
            >
              {/* Modern Header */}
              <ModernModalHeader
                title={config.title}
                subtitle={config.subtitle}
                icon={config.icon}
                onClose={closeModal}
                scrollY={scrollY}
                colors={colors}
              />

              <ScrollView 
                style={styles.modalContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                onScroll={handleScroll}
                scrollEventThrottle={16}
                contentContainerStyle={{ paddingBottom: 80 }}
              >
                {config.content}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },

  // Thin Compact Header Styles
  thinModalHeader: {
    paddingTop: Platform.OS === "ios" ? 8 : 12,
    paddingBottom: 8,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  compactDragIndicator: {
    alignItems: "center",
    paddingVertical: 4,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  compactHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  compactCloseButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  compactHeaderCenter: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 16,
  },
  compactModalTitle: {
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.3,
  },
  compactModalSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 2,
  },
  compactHeaderAction: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 80, // Account for absolute positioned header
  },
});

export default ModalProvider;
