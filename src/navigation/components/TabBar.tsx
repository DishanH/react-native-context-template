import { BlurView } from "expo-blur";
import * as React from "react";
import { useCallback, useEffect } from "react";
import { Dimensions, Platform, StyleSheet, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../contexts";
import { useScrollVisibility } from "../../../contexts/ScrollContext";
import TabBarButton from "./TabBarButton";

// Animation configuration constants
const SPRING_CONFIG = {
  damping: 15,
  stiffness: 120,
};

const FADE_CONFIG = {
  duration: 500,
  easing: Easing.out(Easing.ease),
};

const VISIBILITY_CONFIG = {
  duration: 300,
};

// Tab layout constants
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH - 20; // 10px padding on each side
const TAB_COUNT = 4;
export const TAB_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;

// Create animated BlurView component
// const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

interface TabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export default function TabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();
  const { isScrolling } = useScrollVisibility();
  const { colors } = useTheme();
  
  // Animation values
  const tabBarTranslateY = useSharedValue(100);
  const tabBarOpacity = useSharedValue(0);
  const tabBarScale = useSharedValue(0.8);
  const highlighterPosition = useSharedValue(0);
  const tabBarVisibility = useSharedValue(1);
  
  // Initialize tab bar animations - runs only once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      tabBarTranslateY.value = withSpring(0, SPRING_CONFIG);
      tabBarOpacity.value = withTiming(1, FADE_CONFIG);
      tabBarScale.value = withSpring(1, SPRING_CONFIG);
    }, 300);
    
    // Clean up timeout
    return () => clearTimeout(timer);
  }, [tabBarTranslateY, tabBarOpacity, tabBarScale]); // Empty dependency array since this should only run once
  
  // Update highlighter position when active tab changes
  useEffect(() => {
    if (state.index !== undefined && state.routes.length > 0) {
      const tabWidth = TAB_BAR_WIDTH / state.routes.length;
      highlighterPosition.value = withSpring(state.index * tabWidth, SPRING_CONFIG);
    }
  }, [state.index, highlighterPosition, state.routes.length]);
  
  // Handle tab bar visibility during scrolling
  useEffect(() => {
    tabBarVisibility.value = withTiming(
      isScrolling ? 0 : 1, 
      VISIBILITY_CONFIG
    );
  }, [isScrolling, tabBarVisibility]);
  
  // Animated styles
  const animatedTabBarStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: tabBarTranslateY.value },
      { scale: tabBarScale.value }
    ],
    opacity: tabBarOpacity.value,
  }));

  const animatedHighlighterStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: highlighterPosition.value }],
  }));
  
  const animatedVisibilityStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - tabBarVisibility.value) * 100 }],
    opacity: tabBarVisibility.value,
  }));

  // Handler for tab press
  const handleTabPress = useCallback((route: any, index: number, isFocused: boolean) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  }, [navigation]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { bottom: insets.bottom + 16 },
        animatedVisibilityStyle
      ]}
    >
      <Animated.View style={[styles.tabBar, animatedTabBarStyle]}>
        <View style={[
          StyleSheet.absoluteFill, 
          { 
            backgroundColor: colors.surface,
            opacity: 0.95,
            borderRadius: 35,
          }
        ]} />
        
        {/* Tab Highlighter */}
        <Animated.View 
          style={[
            styles.tabHighlighter,
            { 
              backgroundColor: colors.primary + '30',
              width: state.routes.length > 0 ? (TAB_BAR_WIDTH / state.routes.length) - 20 : TAB_WIDTH - 20
            },
            animatedHighlighterStyle
          ]} 
        />
        
        {/* Tab Buttons */}
        <View style={styles.buttonsContainer}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            return (
              <TabBarButton
                key={`${route.key}-${index}`}
                icon={options.tabBarIcon}
                isFocused={isFocused}
                colors={colors}
                onPress={() => handleTabPress(route, index, isFocused)}
              />
            );
          })}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 60,
    zIndex: 100,
  },
  tabBar: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 35,
    width: '100%',
    ...(Platform.OS === 'ios' ? {
      boxShadow: '0px 6px 8px rgba(0, 0, 0, 0.25)'
    } : {
      elevation: 10, // Keep elevation for Android
    })
  },
  buttonsContainer: {
    flexDirection: 'row',
    height: '100%',
    width: '100%',
    paddingHorizontal: 0,
    flex: 1,
  },
  tabHighlighter: {
    position: 'absolute',
    top: '50%',
    marginTop: -22,
    left: 10,
    height: 44,
    borderRadius: 24,
  },
}); 