import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { BaseToast, ErrorToast, InfoToast } from 'react-native-toast-message';

// Theme-aware toast component wrapper
const ThemedToast = ({ type, ...props }: any) => {
  // Since we can't use hooks here, we'll use the colors passed via props
  const { colors } = props || {};
  
  // Fallback colors if theme colors are not available
  const fallbackColors = {
    surface: '#FFFFFF',
    text: '#1E2022',
    textSecondary: '#52616B',
    success: '#16A34A',
    error: '#DC2626',
    info: '#2563EB',
    warning: '#D97706',
    primary: '#52616B',
  };
  
  const themeColors = colors || fallbackColors;
  
  const getToastStyle = (toastType: string) => {
    return {
      backgroundColor: themeColors.surface,
      borderRadius: 12,
      marginHorizontal: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
      borderWidth: 0, // Remove the left border
    };
  };

  const getIconColor = (toastType: string) => {
    switch (toastType) {
      case 'success': return themeColors.success;
      case 'error': return themeColors.error;
      case 'info': return themeColors.info;
      case 'warning': return themeColors.warning;
      default: return themeColors.primary;
    }
  };

  const getIconName = (toastType: string) => {
    switch (toastType) {
      case 'success': return 'check-circle';
      case 'error': return 'exclamation-circle';
      case 'info': return 'info-circle';
      case 'warning': return 'exclamation-triangle';
      default: return 'info-circle';
    }
  };

  const textStyle1 = {
    fontSize: 15,
    fontWeight: '600',
    color: themeColors.text,
    marginBottom: 2,
  };

  const textStyle2 = {
    fontSize: 13,
    fontWeight: '400',
    color: themeColors.textSecondary,
    lineHeight: 18,
  };

  const iconContainerStyle = {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginLeft: 15,
    marginRight: 5,
  };

  const contentContainerStyle = {
    paddingHorizontal: 15,
    paddingVertical: 12,
  };

  if (type === 'error') {
    return (
      <ErrorToast
        {...props}
        style={getToastStyle(type)}
        contentContainerStyle={contentContainerStyle}
        text1Style={textStyle1}
        text2Style={textStyle2}
        renderLeadingIcon={() => (
          <View style={iconContainerStyle}>
            <FontAwesome5 name={getIconName(type)} size={16} color={getIconColor(type)} />
          </View>
        )}
      />
    );
  }

  if (type === 'info') {
    return (
      <InfoToast
        {...props}
        style={getToastStyle(type)}
        contentContainerStyle={contentContainerStyle}
        text1Style={textStyle1}
        text2Style={textStyle2}
        renderLeadingIcon={() => (
          <View style={iconContainerStyle}>
            <FontAwesome5 name={getIconName(type)} size={16} color={getIconColor(type)} />
          </View>
        )}
      />
    );
  }

  // Default to BaseToast for success and warning
  return (
    <BaseToast
      {...props}
      style={getToastStyle(type)}
      contentContainerStyle={contentContainerStyle}
      text1Style={textStyle1}
      text2Style={textStyle2}
      renderLeadingIcon={() => (
        <View style={iconContainerStyle}>
          <FontAwesome5 name={getIconName(type)} size={16} color={getIconColor(type)} />
        </View>
      )}
    />
  );
};

/**
 * Custom toast configuration that matches the app's theme
 */
export const toastConfig = {
  /*
    Overwrite 'success' type
  */
  success: (props: any) => <ThemedToast type="success" {...props} />,
  /*
    Overwrite 'error' type
  */
  error: (props: any) => <ThemedToast type="error" {...props} />,
  /*
    Overwrite 'info' type
  */
  info: (props: any) => <ThemedToast type="info" {...props} />,
  /*
    Custom 'warning' type
  */
  warning: (props: any) => <ThemedToast type="warning" {...props} />,
};

