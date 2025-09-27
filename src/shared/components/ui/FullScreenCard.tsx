import React, { ReactNode, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FullScreenCardProps {
  /** Whether the card is visible */
  visible: boolean;
  /** Card title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Optional icon for the header */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Card content */
  children: ReactNode;
  /** Function called when close button is pressed */
  onClose: () => void;
  /** Theme colors object */
  colors: any;
  /** Optional callback when card is opened */
  onOpen?: () => void;
  /** Whether to show a blur background */
  showBlur?: boolean;
  /** Animation duration in milliseconds */
  animationDuration?: number;
  /** Height percentage of the screen (0.6 to 0.95) */
  heightPercentage?: number;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const FullScreenCard: React.FC<FullScreenCardProps> = ({
  visible,
  title,
  subtitle,
  icon,
  children,
  onClose,
  colors,
  onOpen,
  showBlur = true,
  animationDuration = 300,
  heightPercentage = 0.99,
}) => {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT * 0.5)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      // Opening animation
      onOpen?.();

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: animationDuration * 0.8,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Closing animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT * 0.5,
          duration: animationDuration * 0.7,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: animationDuration * 0.5,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: animationDuration * 0.7,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, translateY, opacity, scale, animationDuration, onOpen]);

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay}>
      {/* Background overlay */}
      {showBlur && (
        <Animated.View
          style={[
            styles.backgroundOverlay,
            {
              backgroundColor: colors.text + '30',
              opacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backgroundTouchable}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
      )}

      {/* Main card container with centered positioning */}
      <Animated.View
        style={[
          styles.modernCardWrapper,
          {
            transform: [
              { translateY },
              { scale },
            ],
            paddingTop: Math.max(insets.top, 40),
            paddingHorizontal: 8,
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}
      >
        <View
          style={[
            styles.cardContainer,
            {
              backgroundColor: colors.background,
              shadowColor: colors.text,
              height: `${Math.min(Math.max(heightPercentage * 100, 60), 100)}%`,
            },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.keyboardContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
          >
            {/* Header */}
            <View style={[styles.header, { backgroundColor: colors.background }]}>
              {/* Drag indicator */}
              <View style={styles.dragIndicator}>
                <View
                  style={[
                    styles.dragHandle,
                    { backgroundColor: colors.border },
                  ]}
                />
              </View>

              {/* Header content */}
              <View style={styles.headerContent}>
                {/* Close button - positioned absolutely on the right */}
                <TouchableOpacity
                  onPress={onClose}
                  style={[
                    styles.closeButton,
                    {
                      backgroundColor: colors.surface,
                      borderColor: colors.border,
                    },
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={20} color={colors.textSecondary} />
                </TouchableOpacity>

                {/* Title and subtitle - centered */}
                <View style={styles.headerTextContainer}>
                  <View style={styles.titleRow}>
                    {/* {icon && (
                      <View
                        style={[
                          styles.iconContainer,
                          { backgroundColor: colors.primary + '15' },
                        ]}
                      >
                        <Ionicons name={icon} size={20} color={colors.primary} />
                      </View>
                    )} */}
                    <Text style={[styles.title, { color: colors.text }]}>
                      {title}
                    </Text>
                  </View>
                  {subtitle && (
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                      {subtitle}
                    </Text>
                  )}
                </View>
              </View>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundTouchable: {
    flex: 1,
  },
  modernCardWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  cardContainer: {
    borderRadius: 24,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -8 },
        shadowOpacity: 0.25,
        shadowRadius: 24,
      },
      android: {
        elevation: 24,
      },
    }),
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
    paddingHorizontal: 4,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  dragIndicator: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  dragHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    opacity: 0.4,
  },
  headerContent: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    marginTop: 8,
  },
  headerTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
    opacity: 0.75,
    marginTop: 2,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    right: 20,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },
  content: {
    flex: 1,
    paddingTop: 8,
  },
  contentContainer: {
    paddingHorizontal: 28,
    paddingBottom: 48,
    paddingTop: 12,
    minHeight: '100%',
  },
});

export default FullScreenCard;
