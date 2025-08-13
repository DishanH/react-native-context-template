import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated";
import { useScrollVisibility } from "../../../../contexts/ScrollContext";
import { useHeader } from "../../../../contexts";

interface AnimatedHeaderProps {
  title: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  enableBlur?: boolean;
}

export default function AnimatedHeader({
  title,
  headerLeft,
  headerRight,
  backgroundColor = "white",
  titleColor = "#333",
  enableBlur = true,
}: AnimatedHeaderProps) {
  const { scrollY } = useScrollVisibility();
  const { headerHeight, safeAreaTop } = useHeader();

  const isIOS = Platform.OS === "ios";
  const rowHeight = Math.max(0, headerHeight - safeAreaTop);
  const titleFontSize = isIOS ? 18 : 20;
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
      opacity: 0.85, // Light transparency but constant
    };
  });

  // Animated style for header shadow/elevation when scrolling
  const animatedHeaderStyle = useAnimatedStyle(() => {
    const shouldShowShadow = scrollY > 10;
    
    return Platform.OS === 'ios' ? {
      shadowOpacity: interpolate(scrollY, [0, 50], [0, 0.1], "clamp"),
    } : {
      elevation: interpolate(scrollY, [0, 50], [0, 4], "clamp"),
    };
  });

  return (
    <Animated.View style={[
      styles.headerContainer, 
      { height: headerHeight },
      animatedHeaderStyle,
      {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
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

const styles = StyleSheet.create({
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
