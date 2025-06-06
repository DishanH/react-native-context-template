import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { ThemeColors } from '../theme/types';

// Calculate the tab button width
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TAB_BAR_WIDTH = SCREEN_WIDTH - 40; // 20px padding on each side
const TAB_COUNT = 4;
const BUTTON_WIDTH = TAB_BAR_WIDTH / TAB_COUNT;

interface TabBarButtonProps {
  icon: any;
  isFocused: boolean;
  colors: ThemeColors;
  onPress: () => void;
}

export default function TabBarButton({ 
  icon, 
  isFocused, 
  colors,
  onPress 
}: TabBarButtonProps) {

  // Animation for icon scaling and opacity
  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withTiming(isFocused ? 1.2 : 1, { duration: 200 }) }],
      opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
      backgroundColor: 'transparent',
    };
  });

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.iconContainer, iconAnimatedStyle]}>
        {icon({ 
          color: isFocused ? colors.primary : colors.icon, 
          size: 22 
        })}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tabButton: {
    width: BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    padding: 8,
  },
}); 