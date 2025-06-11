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
        headerShown: true,
        headerTitle: route.name !== 'index' && route.name !== 'tabs' ? route.name.charAt(0).toUpperCase() + route.name.slice(1) : "",
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: colors.headerBackground,
          elevation: 0, // Remove shadow on Android
          shadowOpacity: 0, // Remove shadow on iOS
          borderBottomWidth: 0,
          height: Platform.OS === 'ios' ? 115 : 70,
        },
        headerShadowVisible: false,
        drawerType: "slide",
        drawerStyle: {
          width: "75%",
          backgroundColor: colors.drawerBackground,
        },
        swipeEdgeWidth: 50,
        headerLeft: (props) => <CustomDrawerToggle {...props} />,
        // Prevent gestures from opening drawer when not authenticated
        gestureEnabled: true,
      })}
    >
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: "Home",
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="tabs"
        options={{
          drawerLabel: "Dashboard",
          headerShown: false,
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
          headerLeft: () => <CustomBackButton />,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="edit-profile"
        options={{
          drawerLabel: "Edit Profile",
          headerLeft: () => <CustomBackButton />,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="help-faq"
        options={{
          drawerLabel: "Help & FAQ",
          headerLeft: () => <CustomBackButton />,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="privacy-policy"
        options={{
          drawerLabel: "Privacy Policy",
          headerLeft: () => <CustomBackButton />,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
      <Drawer.Screen
        name="terms-of-service"
        options={{
          drawerLabel: "Terms of Service",
          headerLeft: () => <CustomBackButton />,
          drawerItemStyle: { display: 'none' }, // Hide from drawer menu
        }}
      />
    </Drawer>
  );
} 