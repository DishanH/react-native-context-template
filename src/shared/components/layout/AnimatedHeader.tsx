import { BlurView } from "expo-blur";
import React from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, { useAnimatedStyle, interpolate } from "react-native-reanimated";
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

  // Animated style for blur effect
  const animatedBlurStyle = useAnimatedStyle(() => {
    if (!enableBlur) return { opacity: 0 };
    
    const opacity = interpolate(
      scrollY,
      [0, 80, 150],
      [0, 0.05, 0.1],
      "clamp"
    );
    
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



  return (
    <View style={[styles.headerContainer, { height: headerHeight }]}>
      {/* Original background with animated opacity */}
      <Animated.View 
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor },
          animatedBackgroundStyle
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
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {headerLeft}
          </View>
          
          <View style={styles.headerCenter}>
            <Text style={[styles.headerTitle, { color: titleColor }]}>
              {title}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            {headerRight}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    } : {
      elevation: 4,
    }),
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? 44 : 56,
    paddingHorizontal: 16,
  },
  headerLeft: {
    width: 60,
    alignItems: 'flex-start',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerRight: {
    width: 60,
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
}); 