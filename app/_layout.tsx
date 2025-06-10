import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router,Stack } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import Toast from 'react-native-toast-message';
import { BottomSheetProvider } from "./components/BottomSheetProvider";
import { ThemeProvider, useTheme, AuthProvider, useAuth, SubscriptionProvider } from "../contexts";
import { feedback } from "../lib/feedback";
import { toastConfig } from "../lib/toastConfig";
import { storage } from "../lib/storage";

// Loading screen component
function LoadingScreen() {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[styles.loadingText, { color: colors.text }]}>Loading...</Text>
    </View>
  );
}

// Custom drawer content component for authenticated users
function CustomDrawerContent(props: any) {
  const { colors } = useTheme();
  const { user, signOut } = useAuth();

  // Determine current route name to highlight active drawer item
  const currentRouteName = props.state.routes[props.state.index]?.name || "";

  const handleSignOut = async () => {
    feedback.buttonPress();
    feedback.info('Signing Out', 'See you soon!');
    await signOut();
    // Navigation will be handled automatically by auth state change
  };

  return (
    <View
      style={[
        styles.drawerContainer,
        { backgroundColor: colors.drawerBackground },
      ]}
    >
      {/* User Profile Section with background box */}
      <View
        style={[
          styles.profileBox,
          {
            backgroundColor: colors.drawerActiveItemBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        <View style={styles.userSection}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={[styles.userName, { color: colors.text }]}>
            {user?.name || 'User'}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            {user?.email || 'user@example.com'}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <ScrollView style={styles.drawerContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "tabs" || currentRouteName === "index"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("tabs");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="tachometer-alt"
              size={18}
              color={currentRouteName === "tabs" || currentRouteName === "index" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "tabs" || currentRouteName === "index" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "tabs" || currentRouteName === "index" ? "600" : "500",
              },
            ]}
          >
            Dashboard
          </Text>
          {(currentRouteName === "tabs" || currentRouteName === "index") && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "groups"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("groups");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="users"
              size={18}
              color={currentRouteName === "groups" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "groups" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "groups" ? "600" : "500",
              },
            ]}
          >
            Groups
          </Text>
          {currentRouteName === "groups" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "activity"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("activity");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="history"
              size={18}
              color={currentRouteName === "activity" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "activity" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "activity" ? "600" : "500",
              },
            ]}
          >
            Activity
          </Text>
          {currentRouteName === "activity" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "subscription"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("subscription")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="crown"
              size={18}
              color={currentRouteName === "subscription" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "subscription" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "subscription" ? "600" : "500",
              },
            ]}
          >
            Subscription
          </Text>
          {currentRouteName === "subscription" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.drawerItem,
            {
              backgroundColor:
                currentRouteName === "settings"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => {
            feedback.navigate();
            props.navigation.navigate("settings");
          }}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="cog"
              size={18}
              color={currentRouteName === "settings" ? colors.primary : colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: currentRouteName === "settings" ? colors.primary : colors.text,
                fontWeight: currentRouteName === "settings" ? "600" : "500",
              },
            ]}
          >
            Settings
          </Text>
          {currentRouteName === "settings" && (
            <View
              style={[
                styles.activeIndicator,
                { backgroundColor: colors.primary },
              ]}
            />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Button at Bottom */}
      <View style={styles.bottomSection}>
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: colors.error + '15' }
          ]}
          onPress={handleSignOut}
        >
          <FontAwesome5
            name="sign-out-alt"
            size={16}
            color={colors.error}
            style={styles.signOutIcon}
          />
          <Text style={[styles.signOutText, { color: colors.error }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Custom drawer toggle component
function CustomDrawerToggle(props: any) {
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
function CustomBackButton() {
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

// Authenticated app layout with drawer navigation
function AuthenticatedLayout() {
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

// Unauthenticated layout with stack navigation for auth and onboarding
function UnauthenticatedLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: 'slide_from_right',
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="auth" />
      <Stack.Screen name="onboarding" />
    </Stack>
  );
}

// Main navigation component that handles authentication state
function RootNavigator() {
  const { user, isLoading: authLoading } = useAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check onboarding status when app loads
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Handle navigation based on auth and onboarding state
  useEffect(() => {
    if (isLoading || authLoading) return;

    if (!isOnboardingComplete) {
      // User hasn't completed onboarding
      router.replace('/onboarding' as any);
    } else if (!user?.isAuthenticated) {
      // User completed onboarding but not authenticated
      router.replace('/auth' as any);
    } else {
      // User is authenticated, go to main app
      router.replace('/tabs' as any);
    }
  }, [user, isOnboardingComplete, isLoading, authLoading]);

  // Show loading screen while determining initial route
  if (isLoading || authLoading) {
    return <LoadingScreen />;
  }

  // Show appropriate layout based on authentication state
  if (user?.isAuthenticated) {
    return <AuthenticatedLayout />;
  } else {
    return <UnauthenticatedLayout />;
  }
}

// Root layout component with providers
export default function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SubscriptionProvider>
          <BottomSheetProvider>
            <StatusBarManager />
            <RootNavigator />
            <Toast config={toastConfig} />
          </BottomSheetProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Status bar manager component that responds to theme changes
function StatusBarManager() {
  const { theme, colors } = useTheme();
  
  // Update toast colors when theme changes and on initial load
  React.useEffect(() => {
    const { setToastColors } = require("../lib/feedback");
    if (colors) {
      setToastColors(colors);
    }
  }, [colors]);
  
  // Set initial colors immediately
  React.useLayoutEffect(() => {
    const { setToastColors } = require("../lib/feedback");
    if (colors) {
      setToastColors(colors);
    }
  }, []);
  
  return (
    <StatusBar 
      style={theme === 'dark' ? 'light' : 'dark'}
      backgroundColor="transparent"
      translucent={true}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
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
  drawerContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  userSection: {
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    opacity: 0.8,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 8,
    position: "relative",
  },
  drawerIconContainer: {
    marginRight: 16,
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drawerItemText: {
    fontSize: 16,
  },
  activeIndicator: {
    position: "absolute",
    left: 0,
    top: 12,
    bottom: 12,
    width: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "500",
  },
  signOutIcon: {
    marginRight: 16,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    opacity: 0.5,
  },
  profileBox: {
    margin: 16,
    marginTop: Platform.OS === 'ios' ? 10 : 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
  bottomSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
