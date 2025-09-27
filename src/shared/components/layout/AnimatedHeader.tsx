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
  // Animation configuration
  blurIntensity?: number;
  blurTint?: "light" | "dark" | "default";
  backgroundOpacity?: number;
  shadowColor?: string;
  // Layout configuration
  horizontalPadding?: number;
  sideElementMinWidth?: number;
  titleMargin?: number;
  titleFontSize?: number;
  bottomPadding?: number;
  // Animation thresholds
  blurScrollThresholds?: [number, number, number];
  blurOpacityRange?: [number, number, number];
  shadowScrollThresholds?: [number, number];
  shadowOpacityRange?: [number, number];
  shadowElevationRange?: [number, number];
}

export default function AnimatedHeader({
  title,
  headerLeft,
  headerRight,
  backgroundColor = "white",
  titleColor = "#333",
  enableBlur = true,
  // Animation configuration
  blurIntensity = 80,
  blurTint = "light",
  backgroundOpacity = 0.85,
  shadowColor = "#000",
  // Layout configuration
  horizontalPadding = 16,
  sideElementMinWidth = 60,
  titleMargin = 60,
  titleFontSize,
  bottomPadding = 8,
  // Animation thresholds
  blurScrollThresholds = [0, 80, 150],
  blurOpacityRange = [0, 0.05, 0.1],
  shadowScrollThresholds = [0, 50],
  shadowOpacityRange = [0, 0.1],
  shadowElevationRange = [0, 4],
}: AnimatedHeaderProps) {
  const { scrollY } = useScrollVisibility();
  const { headerHeight, safeAreaTop, headerContentHeight } = useHeader();

  const isIOS = Platform.OS === "ios";
  const defaultTitleFontSize = isIOS ? 17 : 20;
  const finalTitleFontSize = titleFontSize || defaultTitleFontSize;
  // Animated style for blur effect
  const animatedBlurStyle = useAnimatedStyle(() => {
    if (!enableBlur) return { opacity: 0 };

    const opacity = interpolate(scrollY, blurScrollThresholds, blurOpacityRange, "clamp");

    return {
      opacity,
    };
  });

  // Animated style for background opacity - configurable transparency
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      opacity: backgroundOpacity,
    };
  });

  // Animated style for header shadow/elevation when scrolling
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return Platform.OS === 'ios' ? {
      shadowOpacity: interpolate(scrollY, shadowScrollThresholds, shadowOpacityRange, "clamp"),
    } : {
      elevation: interpolate(scrollY, shadowScrollThresholds, shadowElevationRange, "clamp"),
    };
  });

  return (
    <Animated.View style={[
      styles.headerContainer,
      { height: headerHeight },
      animatedHeaderStyle,
      {
        shadowColor,
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
            intensity={blurIntensity}
            tint={blurTint}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}

      {/* Content */}
      <View style={[
        styles.headerContent,
        {
          paddingTop: safeAreaTop,
          paddingBottom: bottomPadding,
        }
      ]}>
        <View style={[
          styles.headerRow,
          {
            height: headerContentHeight,
            paddingHorizontal: horizontalPadding,
          }
        ]}>
          {/* Left section */}
          <View style={[
            styles.headerLeft,
            {
              height: headerContentHeight,
              minWidth: sideElementMinWidth,
            }
          ]}>
            {headerLeft}
          </View>

          {/* Absolutely positioned centered title */}
          <View style={[
            styles.headerCenterAbsolute,
            {
              height: headerContentHeight,
              left: titleMargin,
              right: titleMargin,
            }
          ]}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.headerTitle,
                {
                  color: titleColor,
                  fontSize: finalTitleFontSize,
                },
              ]}
            >
              {title}
            </Text>
          </View>

          {/* Right section */}
          <View style={[
            styles.headerRight,
            {
              height: headerContentHeight,
              minWidth: sideElementMinWidth,
            }
          ]}>
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
    position: "relative",
    justifyContent: "space-between",
  },
  headerLeft: {
    alignItems: "flex-start",
    justifyContent: "center",
    paddingLeft: 0,
    flex: 0,
  },
  headerCenterAbsolute: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none", // Allow touches to pass through to left/right elements
  },
  headerRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    paddingRight: 0,
    flex: 0,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});
