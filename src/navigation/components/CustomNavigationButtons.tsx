import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router } from "expo-router";
import { useTheme } from '../../../contexts';
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

  const handleBackPress = () => {
    feedback.back();
    router.push('/settings');
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