import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { useTheme, useNavigationState } from '../../../contexts';
import { feedback } from '../../../lib/feedback';

// Custom drawer toggle component
export function CustomDrawerToggle(props: any) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.toggleButtonContainer,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
    >
      <DrawerToggleButton {...props} tintColor={colors.primary} />
    </View>
  );
}

// Custom back button component
export function CustomBackButton() {
  const { colors } = useTheme();
  const { fromDashboard, setFromDashboard, setShowBackButton } = useNavigationState();
  const pathname = usePathname();

  const handleBackPress = () => {
    feedback.back();

    // Check if we should go back to dashboard
    // Only go back to dashboard if we're on a direct page from dashboard (not sub-pages)
    const isDirectPageFromDashboard = fromDashboard && (
      pathname === '/sos' ||
      pathname === '/progress'
    );

    if (isDirectPageFromDashboard) {
      setFromDashboard(false);
      setShowBackButton(false);
      router.replace('/tabs');
      return;
    }

    // For detail pages, always try to go back to their parent page first
    // Try to go back in navigation stack first
    if (router.canGoBack()) {
      router.back();
      return;
    }

    // If no back navigation available, intelligently navigate to parent page
    // based on current route
    if(pathname.startsWith('/stories/detail/') || pathname.startsWith('/story/detail/') || (pathname.startsWith('/stories/') && pathname.match(/^\/stories\/\d+$/))){
    } else {
      // Default fallback - check if we came from dashboard
      if (fromDashboard) {
        setFromDashboard(false);
        setShowBackButton(false);
        router.replace('/tabs');
      } else {
        // Just try to go back or fallback to dashboard
        router.replace('/tabs');
      }
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.backButtonContainer,
        {
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.border,
        },
      ]}
      onPress={handleBackPress}
    >
      <FontAwesome5 name="arrow-left" size={18} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleButtonContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  backButtonContainer: {
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
}); 