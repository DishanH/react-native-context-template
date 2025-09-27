import React from 'react';
import { View, StyleSheet } from 'react-native';
import HideableHeader from './HideableHeader';
import { CustomDrawerToggle, CustomBackButton } from '../../../navigation/components';
import { useTheme, useHeader, HeaderProvider, useNavigationState } from '../../../../contexts';

interface PageWithHideableHeaderProps {
  title: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
}

// Component that always ensures HeaderProvider is available
// This avoids conditional hook calls by always providing context
function EnsureHeaderProvider({ children }: { children: React.ReactNode }) {
  // Always wrap with HeaderProvider to ensure consistency
  // This is safer than conditional hook calls and avoids the
  // "Rendered more hooks than during the previous render" error
  return <HeaderProvider>{children}</HeaderProvider>;
}

export default function PageWithHideableHeader({
  title,
  children,
  showBackButton = false,
  headerLeft,
  headerRight,
}: PageWithHideableHeaderProps) {
  const { colors } = useTheme();
  const { showBackButton: showBackFromContext } = useNavigationState();

  // Determine header left component - use context state or prop
  const shouldShowBack = showBackFromContext || showBackButton;
  const leftComponent = headerLeft || (shouldShowBack ? <CustomBackButton /> : <CustomDrawerToggle />);

  return (
    <EnsureHeaderProvider>
      <HideableHeader
        title={title}
        headerLeft={leftComponent}
        headerRight={headerRight}
        backgroundColor={colors.headerBackground}
        titleColor={colors.text}
        enableBlur={true}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {children}
        </View>
      </HideableHeader>
    </EnsureHeaderProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
