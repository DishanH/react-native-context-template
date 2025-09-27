import { BlurView } from "expo-blur";
import React, { createContext, useContext, useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useHeader } from "../../../../contexts";

// Create a local scroll context for this header
interface HideableHeaderScrollContextType {
  scrollY: number;
  setScrollY: (value: number) => void;
  onScroll: (event: any) => void;
}

const HideableHeaderScrollContext = createContext<HideableHeaderScrollContextType | null>(null);

export const useHideableHeaderScroll = () => {
  const context = useContext(HideableHeaderScrollContext);
  if (!context) {
    throw new Error('useHideableHeaderScroll must be used within HideableHeaderProvider');
  }
  return context;
};

interface HideableHeaderProps {
  title: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  enableBlur?: boolean;
  children: React.ReactNode;
}

function HideableHeaderProvider({ children }: { children: React.ReactNode }) {
  const [scrollY, setScrollY] = useState(0);
  const lastScrollY = useSharedValue(0);

  const onScroll = (event: any) => {
    const currentY = event.nativeEvent.contentOffset.y;
    setScrollY(currentY);
  };

  return (
    <HideableHeaderScrollContext.Provider value={{ scrollY, setScrollY, onScroll }}>
      {children}
    </HideableHeaderScrollContext.Provider>
  );
}

function HideableHeaderContent({
  title,
  headerLeft,
  headerRight,
  backgroundColor = "white",
  titleColor = "#333",
  enableBlur = true,
}: Omit<HideableHeaderProps, 'children'>) {
  const { scrollY } = useHideableHeaderScroll();
  const { headerHeight, safeAreaTop } = useHeader();
  
  const headerTranslateY = useSharedValue(0);
  const lastScrollY = useSharedValue(0);

  const isIOS = Platform.OS === "ios";
  const rowHeight = Math.max(0, headerHeight - safeAreaTop);
  const titleFontSize = isIOS ? 18 : 20;

  // Animated style for header translation based on scroll
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const currentScrollY = scrollY;
    const threshold = 5; // Minimum scroll distance to trigger direction change
    const hideThreshold = 50; // Scroll position to start hiding/showing header

    if (Math.abs(currentScrollY - lastScrollY.value) > threshold) {
      const direction = currentScrollY > lastScrollY.value ? 'down' : 'up';

      // Hide header when scrolling down and past threshold
      if (direction === 'down' && currentScrollY > hideThreshold) {
        headerTranslateY.value = withTiming(-headerHeight, {
          duration: 250,
        });
      }
      // Show header when scrolling up or at the top
      else if (direction === 'up' || currentScrollY <= hideThreshold) {
        headerTranslateY.value = withTiming(0, {
          duration: 250,
        });
      }

      lastScrollY.value = currentScrollY;
    }

    return {
      transform: [{ translateY: headerTranslateY.value }],
    };
  }, [scrollY, headerHeight]);

  // Animated style for blur effect
  const animatedBlurStyle = useAnimatedStyle(() => {
    if (!enableBlur) return { opacity: 0 };

    const opacity = interpolate(scrollY, [0, 80, 150], [0, 0.05, 0.1], "clamp");

    return {
      opacity,
    };
  });

  // Animated style for background opacity - keep background color constant
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: 0.95, // Slightly more opaque for better visibility
    };
  });

  // Animated style for header shadow/elevation when scrolling
  const animatedShadowStyle = useAnimatedStyle(() => {
    return Platform.OS === 'ios' ? {
      shadowOpacity: interpolate(scrollY, [0, 50], [0, 0.15], "clamp"),
    } : {
      elevation: interpolate(scrollY, [0, 50], [0, 6], "clamp"),
    };
  });

  return (
    <Animated.View style={[
      styles.headerContainer, 
      { height: headerHeight },
      animatedHeaderStyle,
      animatedShadowStyle,
      {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
      }
    ]}>
      {/* Original background with animated opacity */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor },
          animatedBackgroundStyle,
        ]}
      />

      {/* Blur overlay */}
      {enableBlur && (
        <Animated.View style={[StyleSheet.absoluteFill, animatedBlurStyle]}>
          <BlurView
            intensity={80}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Content */}
      <View style={[styles.headerContent, { paddingTop: safeAreaTop }]}>
        <View style={[styles.headerRow, { height: rowHeight }]}>
          {/* Left section */}
          <View style={[styles.headerLeft, { height: rowHeight }]}>
            {headerLeft}
          </View>

          {/* Absolutely positioned centered title */}
          <View style={styles.headerCenterAbsolute}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle,
                {
                  color: titleColor,
                  textAlign: "center",
                  fontSize: titleFontSize,
                },
                isIOS
                  ? { includeFontPadding: false, textAlignVertical: "center" }
                  : null,
              ]}
            >
              {title}
            </Text>
          </View>

          {/* Right section */}
          <View style={[styles.headerRight, { height: rowHeight }]}>
            {headerRight}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// Main component that combines provider and header
export default function HideableHeader({
  title,
  headerLeft,
  headerRight,
  backgroundColor,
  titleColor,
  enableBlur,
  children,
}: HideableHeaderProps) {
  return (
    <HideableHeaderProvider>
      <View style={styles.container}>
        {children}
        <HideableHeaderContent
          title={title}
          headerLeft={headerLeft}
          headerRight={headerRight}
          backgroundColor={backgroundColor}
          titleColor={titleColor}
          enableBlur={enableBlur}
        />
      </View>
    </HideableHeaderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  headerContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom:6
  },
  headerLeft: {
    alignItems: "flex-start",
    flex: 1,
  },
  headerCenterAbsolute: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none", // Allow touches to pass through to left/right elements
  },
  headerRight: {
    alignItems: "flex-end",
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
});
