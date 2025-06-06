import { FontAwesome5 } from "@expo/vector-icons";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BottomSheetProvider } from "./components/BottomSheetProvider";
import { ThemeProvider, useTheme } from "./theme/ThemeContext";
import { AuthProvider, useAuth } from "./utils/authContext";
import { storage } from "./utils/storage";

// Custom drawer content component
function CustomDrawerContent(props: any) {
  const { colors } = useTheme();
  const { logout } = useAuth();

  // Determine current route name to highlight active drawer item
  const currentRouteName = props.state.routes[props.state.index]?.name || "";

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
          <Text style={[styles.userName, { color: colors.text }]}>John Doe</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            john.doe@example.com
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
          onPress={() => props.navigation.navigate("tabs")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="tachometer-alt"
              size={20}
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
          onPress={() => props.navigation.navigate("groups")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="users"
              size={20}
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
          onPress={() => props.navigation.navigate("activity")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="history"
              size={20}
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
                currentRouteName === "settings"
                  ? colors.drawerActiveItemBackground
                  : "transparent",
            },
          ]}
          onPress={() => props.navigation.navigate("settings")}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="cog"
              size={20}
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
        
        <View style={[styles.divider, { backgroundColor: colors.divider }]} />
        
        <TouchableOpacity
          style={[
            styles.drawerItem,
          ]}
        >
          <View style={styles.drawerIconContainer}>
            <FontAwesome5
              name="question-circle"
              size={18}
              color={colors.icon}
            />
          </View>
          <Text
            style={[
              styles.drawerItemText,
              {
                color: colors.text,
              },
            ]}
          >
            Help & Feedback
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Sign Out Button */}
      <TouchableOpacity 
        style={[
          styles.signOutButton,
          { backgroundColor: colors.drawerActiveItemBackground }
        ]}
        onPress={() => {
          props.navigation.closeDrawer();
          setTimeout(() => {
            logout();
          }, 300);
        }}
      >
        <FontAwesome5
          name="sign-out-alt"
          size={18}
          color={colors.error}
          style={styles.signOutIcon}
        />
        <Text style={[styles.signOutText, { color: colors.error }]}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// Custom Drawer Toggle Button with circular background
function CustomDrawerToggle(props: any) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.toggleButtonContainer,
        { backgroundColor: colors.headerBackground },
      ]}
    >
      <DrawerToggleButton {...props} tintColor={colors.text} />
    </View>
  );
}

// Wrap the root component with ThemeProvider
function RootLayoutWithTheme({ initialRoute }: { initialRoute: string }) {
  const { colors } = useTheme();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  
  // Set initial route when component mounts
  useEffect(() => {
    // Don't redirect if auth is still loading
    if (authLoading) return;
    
    if (initialRoute === '/onboarding') {
      router.replace('/onboarding' as any);
    } else if (!isAuthenticated) {
      // Only redirect to login if not authenticated
      router.replace('/login' as any);
    } else if (isAuthenticated && initialRoute === '/') {
      // If authenticated and initial route is root, go to tabs
      router.replace('/tabs' as any);
    }
  }, [initialRoute, isAuthenticated, authLoading]);

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
          height: Platform.OS === 'ios' ? 80 : 60,
        },
        headerShadowVisible: false,
        drawerType: "slide",
        drawerStyle: {
          width: "75%",
          backgroundColor: colors.drawerBackground,
        },
        swipeEdgeWidth: 50,
        headerLeft: (props) => <CustomDrawerToggle {...props} />,
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
        name="settings"
        options={{
          drawerLabel: "Settings",
          drawerIcon: ({ color }) => (
            <FontAwesome5 name="cog" size={20} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="onboarding"
        options={{
          drawerLabel: "Onboarding",
          drawerItemStyle: { display: 'none' },  // Hide from drawer
          headerShown: false,  // Hide header on onboarding screen
        }}
      />
      
      <Drawer.Screen
        name="login"
        options={{
          drawerLabel: "Login",
          drawerItemStyle: { display: 'none' },  // Hide from drawer
          headerShown: false,  // Hide header on login screen
        }}
      />
    </Drawer>
  );
}

// Export the root layout wrapped with ThemeProvider
export default function RootLayout() {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  // Check onboarding status from storage when component mounts
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const onboardingStatus = await storage.getOnboardingStatus();
        setIsOnboardingComplete(onboardingStatus);
        
        if (!onboardingStatus) {
          setInitialRoute('/onboarding');
        } else {
          setInitialRoute('/');
        }
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setIsOnboardingComplete(false);
        setInitialRoute('/onboarding');
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, []);

  // Show a loading state while checking onboarding status
  if (isLoading || !initialRoute) {
    return null;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BottomSheetProvider>
          <RootLayoutWithTheme initialRoute={initialRoute} />
        </BottomSheetProvider>
      </AuthProvider>
    </ThemeProvider>
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
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
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
    margin: 16,
    padding: 16,
    borderRadius: 10,
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
    marginTop: 20,
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
});
