import React from 'react';
import { RefreshControl, Platform } from 'react-native';

interface CustomRefreshControlProps {
  refreshing: boolean;
  onRefresh: () => void;
  colors: any;
  headerHeight?: number;
}

export const CustomRefreshControl: React.FC<CustomRefreshControlProps> = ({
  refreshing,
  onRefresh,
  colors,
  headerHeight = 0
}) => {
  // Calculate proper offset for mobile devices considering header height
  const progressViewOffset = Platform.OS === 'android'
    ? Math.max(headerHeight + 20, 60) // Ensure minimum offset for Android
    : undefined;

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.surface}
      // iOS specific props
      title={Platform.OS === 'ios' ? 'Pull to refresh' : undefined}
      titleColor={colors.textSecondary}
      // Android specific props - account for header height
      progressViewOffset={progressViewOffset}
      size={Platform.OS === 'android' ? RefreshControl.SIZE.DEFAULT : undefined}
    />
  );
};