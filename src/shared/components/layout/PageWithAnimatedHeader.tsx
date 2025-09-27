import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedHeader from './AnimatedHeader';
import { CustomDrawerToggle, CustomBackButton } from '../../../navigation/components';
import { useTheme, HeaderProvider, useNavigationState } from '../../../../contexts';

interface PageWithAnimatedHeaderProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  bottomPadding?: number;
}

export default function PageWithAnimatedHeader({
  title,
  children,
  showBackButton = false,
  headerLeft,
  headerRight,
  bottomPadding = 8,
}: PageWithAnimatedHeaderProps) {
  const { colors } = useTheme();
  const { showBackButton: showBackFromContext } = useNavigationState();

  // Determine header left component - use context state or prop
  const shouldShowBack = showBackFromContext || showBackButton;
  const leftComponent = headerLeft || (shouldShowBack ? <CustomBackButton /> : <CustomDrawerToggle />);

  return (
    <HeaderProvider bottomPadding={bottomPadding}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {children}

        {/* Animated Header Overlay */}
        <AnimatedHeader
          title={title}
          headerLeft={leftComponent}
          headerRight={headerRight}
          backgroundColor={colors.headerBackground}
          titleColor={colors.text}
          enableBlur={true}
          bottomPadding={bottomPadding}
        />
      </View>
    </HeaderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 