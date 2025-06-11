import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { useTheme } from '../../../../contexts';
import { feedback } from '../../../../lib/feedback';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { colors } = useTheme();

  const handlePress = () => {
    if (!disabled && !loading) {
      feedback.buttonPress();
      onPress();
    }
  };

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.button,
      ...styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonPrimary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonSecondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonOutline,
          borderWidth: 1,
          borderColor: colors.buttonOutlineText,
        };
      case 'destructive':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonDestructive,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: colors.buttonGhost,
        };
      case 'link':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
          minHeight: 'auto',
        };
      default:
        return baseStyle;
    }
  };

  const getTextStyle = (): TextStyle => {
    const baseTextStyle: TextStyle = {
      ...styles.buttonText,
      ...styles[`buttonText${size.charAt(0).toUpperCase() + size.slice(1)}` as keyof typeof styles],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseTextStyle,
          color: colors.buttonPrimaryText,
        };
      case 'secondary':
        return {
          ...baseTextStyle,
          color: colors.buttonSecondaryText,
        };
      case 'outline':
        return {
          ...baseTextStyle,
          color: colors.buttonOutlineText,
        };
      case 'destructive':
        return {
          ...baseTextStyle,
          color: colors.buttonDestructiveText,
        };
      case 'ghost':
        return {
          ...baseTextStyle,
          color: colors.buttonGhostText,
        };
      case 'link':
        return {
          ...baseTextStyle,
          color: colors.buttonLink,
          textDecorationLine: 'underline',
        };
      default:
        return baseTextStyle;
    }
  };

  const buttonStyle = getButtonStyle();
  const finalTextStyle = getTextStyle();

  return (
    <TouchableOpacity
      style={[
        buttonStyle,
        disabled && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'destructive' ? colors.buttonPrimaryText : colors.text} 
        />
      ) : (
        <Text style={[finalTextStyle, textStyle]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44,
  },
  buttonSm: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  buttonMd: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  buttonLg: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 52,
  },
  buttonText: {
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonTextSm: {
    fontSize: 14,
  },
  buttonTextMd: {
    fontSize: 16,
  },
  buttonTextLg: {
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Button; 