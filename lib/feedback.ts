import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

/**
 * Centralized feedback service for haptics and toast notifications
 * Provides consistent user feedback across the entire application
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

// Store current theme colors (will be set by theme context)
let currentColors: any = null;

/**
 * Set the current theme colors for toast notifications
 */
export const setToastColors = (colors: any) => {
  currentColors = colors;
};

/**
 * Show a toast notification with optional haptic feedback
 */
export const showToast = (
  type: ToastType,
  title: string,
  message?: string,
  haptic: HapticType | null = 'light'
) => {
  // Trigger haptic feedback first
  if (haptic) {
    triggerHaptic(haptic);
  }

  // Show toast notification with theme colors (fallback will be used if colors not set)
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 60,
    props: {
      colors: currentColors
    }
  });
};

/**
 * Trigger haptic feedback
 */
export const triggerHaptic = (type: HapticType) => {
  switch (type) {
    case 'light':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case 'medium':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case 'heavy':
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case 'success':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case 'warning':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case 'error':
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
  }
};

/**
 * Convenience methods for common feedback scenarios
 */
export const feedback = {
  success: (title: string, message?: string) => 
    showToast('success', title, message, 'success'),
  
  error: (title: string, message?: string) => 
    showToast('error', title, message, 'error'),
  
  info: (title: string, message?: string) => 
    showToast('info', title, message, 'light'),
  
  warning: (title: string, message?: string) => 
    showToast('warning', title, message, 'warning'),
  
  // Button press haptics
  buttonPress: () => triggerHaptic('light'),
  buttonSuccess: () => triggerHaptic('success'),
  buttonError: () => triggerHaptic('error'),
  
  // Navigation haptics
  navigate: () => triggerHaptic('light'),
  back: () => triggerHaptic('light'),
  
  // Form haptics
  formSuccess: () => triggerHaptic('success'),
  formError: () => triggerHaptic('error'),
  inputFocus: () => triggerHaptic('light'),
}; 