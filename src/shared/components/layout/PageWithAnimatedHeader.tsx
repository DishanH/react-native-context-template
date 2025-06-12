import React from 'react';
import { View, StyleSheet } from 'react-native';
import AnimatedHeader from './AnimatedHeader';
import { CustomDrawerToggle, CustomBackButton } from '../../../navigation/components';
import { useTheme, HeaderProvider } from '../../../../contexts';

interface PageWithAnimatedHeaderProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

export default function PageWithAnimatedHeader({
  title,
  children,
  showBackButton = false,
  headerLeft,
  headerRight,
}: PageWithAnimatedHeaderProps) {
  const { colors } = useTheme();

  // Determine header left component
  const leftComponent = headerLeft || (showBackButton ? <CustomBackButton /> : <CustomDrawerToggle />);

  return (
    <HeaderProvider>
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