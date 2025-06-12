import React from 'react';
import { Platform } from 'react-native';
import { FontAwesome5 } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";
import { useTheme } from '../../../contexts';
import { CustomDrawerContent, CustomDrawerToggle, CustomBackButton } from '../components';

// Authenticated app layout with drawer navigation
export function AuthenticatedLayout() {
  const { colors } = useTheme();

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        headerShown: false, // Disable default headers for all screens
        drawerType: "slide",
        drawerStyle: {
          width: "75%",
          backgroundColor: colors.drawerBackground,
        },
        swipeEdgeWidth: 50,
        gestureEnabled: true,
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
        }}
      />
      <Drawer.Screen
        name="tabs"
        options={{
          drawerLabel: "Dashboard",
        }}
      />
      <Drawer.Screen
        name="groups"
        options={{
          drawerLabel: "Groups",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="users" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="activity"
        options={{
          drawerLabel: "Activity",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="history" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="subscription"
        options={{
          drawerLabel: "Subscription",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="crown" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="cog" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: "About",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="edit-profile"
        options={{
          drawerLabel: "Edit Profile",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="help-faq"
        options={{
          drawerLabel: "Help & FAQ",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="privacy-policy"
        options={{
          drawerLabel: "Privacy Policy",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="terms-of-service"
        options={{
          drawerLabel: "Terms of Service",
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
    </Drawer>
  );
} 